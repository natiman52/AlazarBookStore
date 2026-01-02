import telegram
from telegram import Update, InlineKeyboardButton, InlineKeyboardMarkup
from telegram.ext import Application, CommandHandler, MessageHandler, filters, ContextTypes, ConversationHandler, CallbackQueryHandler
import mysql.connector
import os
import logging
import pandas as pd
import requests
from typing import List, Dict, Any, Optional
import dotenv
from urllib.parse import urlparse
dotenv.load_dotenv()
# Set up logging
logging.basicConfig(
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s', 
    level=logging.INFO
)
logger = logging.getLogger(__name__)


IMAGE_STORAGE_PATH = os.path.dirname(os.path.realpath(__file__)) + "/public/book_images"
os.makedirs(IMAGE_STORAGE_PATH, exist_ok=True)


TOKEN = os.getenv("TELEGRAM_BOT_TOKEN")
FILE_STORAGE_CHANNEL_ID =os.getenv("TELEGRAM_CHANNEL_ID")
ADMIN_USER_ID = [5916186791, 5397131005]  

CHANNEL_USERNAME = "@Yemesahft_Alem"  

result = urlparse(os.getenv("DATABASE_URL"))
DB_CONFIG = {
    "host": result.hostname,
    "user": result.username,
    "password": result.password,
    "database": result.path.strip('/')
}
# ------------------------------------

# --- CATEGORY DEFINITION ---
CATEGORIES = [
   ("Ethiopian Fiction","Ethiopian Fiction"),
    ("History","History"),
    ("Science","Science"),
    ("Religion","Religion"),
    ("Philosophy","Philosophy"),
    ("Psychology","Psychology"),
    ("Biography","Biography"),
    ("Others","Others"),
    ("school","school"),
]
CATEGORY_MAP = {data: name for name, data in CATEGORIES}

# Conversation states for adding a book
NAME, DESCRIPTION, AUTHOR, RATING, CATEGORY, IMAGE, DOWNLOAD = range(7)

# Conversation states for BULK ADDITION
BULK_UPLOAD, BULK_FILE = range(7, 9)

# --- DATABASE FUNCTIONS ---

def get_db_connection():
    """Establishes a connection to the MySQL database."""
    try:
        conn = mysql.connector.connect(**DB_CONFIG)
        return conn
    except mysql.connector.Error as err:
        logger.error(f"Error connecting to MySQL: {err}")
        return None

def add_book_to_db(book_data: Dict[str, Any]) -> bool:
    """Inserts book data into the database."""
    conn = get_db_connection()
    if not conn:
        return False

    cursor = conn.cursor()

    # Prepare values
    rating = book_data.get('rating')
    if rating is None or rating == "":
        rating = 0.0

    sql = """
    INSERT INTO books (name, description, author, rating, category, image_path, 
                      download_link, channel_message_id, file_name, file_size, slug)
    VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
    """
    try:
        # Create a basic slug for the name and author
        slug = book_data.get('name', 'untitled').lower().replace(' ', '-') + "-" + book_data.get('author', 'unknown').lower().replace(' ', '-')
        slug = "".join(c for c in slug if c.isalnum() or c in ('-', '_')).replace('--', '-')

        cursor.execute(sql, (
            book_data['name'], 
            book_data.get('description', ''),
            book_data.get('author', 'Unknown'),
            rating, 
            book_data.get('category', 'Others'),
            book_data.get('image_path'), # This is the local image path
            book_data.get('download_link'), # External link if channel upload failed
            book_data.get('channel_message_id'), # Channel message ID if uploaded
            book_data.get('file_name'),
            book_data.get('file_size'),
            slug
        ))
        conn.commit()
        logger.info(f"Book '{book_data['name']}' added to database")
        return True
    except Exception as e:
        logger.error(f"Database error: {e}")
        conn.rollback()
        return False
    finally:
        cursor.close()
        conn.close()

def get_all_books():
    """Retrieves all books from the database."""
    conn = get_db_connection()
    if not conn: return []
    cursor = conn.cursor(dictionary=True)
    sql = "SELECT id, name, author, category, image_path FROM books ORDER BY name"
    cursor.execute(sql)
    books = cursor.fetchall()
    cursor.close()
    conn.close()
    return books

def get_book_details(book_id):
    """Retrieves full details for a single book, including category."""
    conn = get_db_connection()
    if not conn: return None
    cursor = conn.cursor(dictionary=True)
    sql = "SELECT * FROM books WHERE id = %s"
    cursor.execute(sql, (book_id,))
    book = cursor.fetchone()
    cursor.close()
    conn.close()
    return book

# --- UTILITY FUNCTIONS ---

def format_size(size_bytes: Optional[int]) -> str:
    """Converts a file size in bytes to a human-readable string (KB, MB, GB)."""
    if size_bytes is None or type(size_bytes) == str:
        return "N/A"
    
    size_bytes = int(size_bytes)
    
    if size_bytes < 1024:
        return f"{size_bytes} B"
    elif size_bytes < 1024**2:
        return f"{size_bytes / 1024:.2f} KB"
    elif size_bytes < 1024**3:
        return f"{size_bytes / 1024**2:.2f} MB"
    else:
        return f"{size_bytes / 1024**3:.2f} GB"

async def is_member(user_id: int, context: ContextTypes.DEFAULT_TYPE) -> bool:
    """Checks if a user is a member of the required channel."""
    if user_id in ADMIN_USER_ID:
        return True
    try:
        chat_member = await context.bot.get_chat_member(chat_id=CHANNEL_USERNAME, user_id=user_id)
        status = chat_member.status
        return status in [telegram.constants.ChatMemberStatus.MEMBER, 
                         telegram.constants.ChatMemberStatus.ADMINISTRATOR, 
                         telegram.constants.ChatMemberStatus.OWNER]
    except Exception as e:
        logger.error(f"Error during membership check: {e}")
        return False

# --- COMMAND HANDLERS (start, list_books, check_membership_for_all_messages, handle_callback are omitted for brevity, assumed to be unchanged) ---

# --- SINGLE BOOK ADDITION CONVERSATION HANDLERS ---

async def add_book_start(update: Update, context: ContextTypes.DEFAULT_TYPE) -> int:
    """Starts the conversation for adding a single book."""
    if update.effective_user.id not in ADMIN_USER_ID:
        await update.message.reply_text("🚫 Only the admin can use this command.")
        return ConversationHandler.END
    context.user_data['book'] = {}
    await update.message.reply_text("Starting new book entry. Please send the **Name** of the book.")
    return NAME

async def get_name(update: Update, context: ContextTypes.DEFAULT_TYPE) -> int:
    """
    RENAMING LOGIC ADDED HERE: Appends channel username to the book name.
    """
    original_name = update.message.text.strip()
    new_name = f"{original_name} {CHANNEL_USERNAME}"
    
    context.user_data['book']['name'] = new_name
    await update.message.reply_text(f"Name set to: {new_name}\nNow, please send the **Description**.")
    return DESCRIPTION

async def get_description(update: Update, context: ContextTypes.DEFAULT_TYPE) -> int:
    context.user_data['book']['description'] = update.message.text
    await update.message.reply_text(f"Description set.\nNow, please send the **Author**.")
    return AUTHOR

async def get_author(update: Update, context: ContextTypes.DEFAULT_TYPE) -> int:
    context.user_data['book']['author'] = update.message.text
    await update.message.reply_text(f"Author set.\nNow, please send the **Rating** (e.g., 8.5, or type '0' to skip).")
    return RATING

async def get_rating(update: Update, context: ContextTypes.DEFAULT_TYPE) -> int:
    rating_text = update.message.text.replace(',', '.').strip()
    try:
        rating = float(rating_text)
        context.user_data['book']['rating'] = rating
    except ValueError:
        context.user_data['book']['rating'] = 0.0
        await update.message.reply_text("Invalid rating format. Setting rating to 0.")
    
    keyboard = [[InlineKeyboardButton(name, callback_data=data)] for name, data in CATEGORIES]
    await update.message.reply_text("Rating set.\nNow, please select the **Category**:", reply_markup=InlineKeyboardMarkup(keyboard))
    return CATEGORY

async def get_category(update: Update, context: ContextTypes.DEFAULT_TYPE) -> int:
    query = update.callback_query
    await query.answer()
    category_data = query.data
    context.user_data['book']['category'] = category_data
    
    await context.bot.edit_message_text(
        chat_id=query.message.chat_id,
        message_id=query.message.message_id,
        text=f"Category set to: {category_data}.\nNow, please send the **Image/Cover Photo**."
    )
    return IMAGE

async def get_image(update: Update, context: ContextTypes.DEFAULT_TYPE) -> int:
    photo_file = update.message.photo[-1]  # Get the highest resolution photo
    
    # Generate a unique filename and path
    unique_id = os.urandom(8).hex()
    file_ext = ".jpg"
    image_filename = f"{unique_id}{file_ext}"
    image_path = os.path.join(IMAGE_STORAGE_PATH, image_filename)
    
    # Download the file locally
    try:
        telegram_file = await context.bot.get_file(photo_file.file_id)
        await telegram_file.download_to_drive(image_path)
        context.user_data['book']['image_path'] = image_path
        await update.message.reply_text("Image saved locally.\nFinally, please send the **Book File** (PDF/ePub) as a document, or send a **direct download link**.")
        return DOWNLOAD
    except Exception as e:
        logger.error(f"Failed to download image: {e}")
        await update.message.reply_text("Error downloading image. Please try again.")
        return IMAGE

async def get_download(update: Update, context: ContextTypes.DEFAULT_TYPE) -> int:
    book_data = context.user_data['book']
    
    book_file_name = None
    book_file_size = None
    channel_message_id = None
    download_link = None # External URL fallback

    if update.message.document:
        # Option 1: Document uploaded directly to the bot
        doc = update.message.document
        
        # 1. Forward to the private channel
        try:
            forwarded_message = await context.bot.send_document(
                chat_id=FILE_STORAGE_CHANNEL_ID,
                document=doc.file_id,
                caption=f"Book: {book_data.get('name', 'N/A')}"
            )
            # 2. Capture details
            channel_message_id = forwarded_message.message_id
            book_file_name = doc.file_name
            book_file_size = doc.file_size
            logger.info(f"Book '{book_data['name']}' uploaded to channel: {channel_message_id}")
            
        except Exception as e:
            logger.error(f"Failed to send book to storage channel: {e}")
            await update.message.reply_text(
                "❌ **Error:** Failed to upload book to the storage channel. Please ensure the bot is an admin in the channel. Please try again or send a direct link."
            )
            return DOWNLOAD
            
    elif update.message.text:
        # Option 2: Direct download link provided
        download_link = update.message.text.strip()
        
        # Simple check for valid link format
        if not download_link.lower().startswith(('http', 'https', 'ftp')):
            await update.message.reply_text("That does not look like a valid link. Please send a direct download link or the document file.")
            return DOWNLOAD
            
    else:
        await update.message.reply_text("Invalid input. Please send the Book File or a direct download link.")
        return DOWNLOAD

    # Save to database
    book_data['channel_message_id'] = channel_message_id
    book_data['file_name'] = book_file_name
    book_data['file_size'] = book_file_size
    book_data['download_link'] = download_link

    if add_book_to_db(book_data):
        await update.message.reply_text(
            f"✅ **Book successfully added!**\n\n"
            f"Name: {book_data['name']}\n"
            f"Author: {book_data['author']}\n"
            f"Storage: {'Telegram Channel' if channel_message_id else 'External Link'}"
        , parse_mode='Markdown')
        return ConversationHandler.END
    else:
        # If DB insert fails, clean up the local image file
        if book_data.get('image_path') and os.path.exists(book_data['image_path']):
            os.remove(book_data['image_path'])
        
        await update.message.reply_text("❌ **Error:** Failed to save book data to the database. Entry cancelled.")
        return ConversationHandler.END

async def cancel(update: Update, context: ContextTypes.DEFAULT_TYPE) -> int:
    """Cancels and ends the single book addition conversation."""
    book_data = context.user_data.get('book', {})
    # Clean up local image file if it exists
    if book_data.get('image_path') and os.path.exists(book_data['image_path']):
        os.remove(book_data['image_path'])
    
    await update.message.reply_text('Book addition cancelled.')
    return ConversationHandler.END

# ----------------------------------------------------------------------------------------------------------------------------------------------------------------

# --- BULK BOOK ADDITION CONVERSATION HANDLERS (with full file handling) ---

async def bulk_upload_start(update: Update, context: ContextTypes.DEFAULT_TYPE) -> int:
    """Starts the /bulk_add conversation for admins."""
    if update.effective_user.id not in ADMIN_USER_ID:
        await update.message.reply_text("🚫 Only the admin can use this command.")
        return ConversationHandler.END
    
    await update.message.reply_text(
        "📦 **Bulk Book Upload** 📦\n\n"
        "Please prepare a **CSV, Excel, or ODS** file with the following exact columns:\n"
        "`Name`, `Author`, `Description`, `Rating`, `Category`, `Image_URL`, `Download_Link`\n\n"
        "**NOTE:** The Name in the spreadsheet will be renamed to `[Original Name] @Yemesahft_Alem`.\n"
        "**Send the spreadsheet file now.**",
        parse_mode='Markdown'
    )
    return BULK_UPLOAD

async def handle_spreadsheet(update: Update, context: ContextTypes.DEFAULT_TYPE) -> int:
    """Processes the uploaded spreadsheet file, downloading and securing all files."""
    if not update.message.document:
        await update.message.reply_text("That was not a document. Please send the spreadsheet file (CSV/XLSX).")
        return BULK_UPLOAD
    
    document = update.message.document
    file_id = document.file_id
    file_name = document.file_name
    
    if not (file_name.lower().endswith(('.csv', '.xlsx', '.xls', '.ods'))):
        await update.message.reply_text(
            f"Unsupported file type: `{file_name}`. Please send a CSV, XLSX, XLS, or ODS file.",
            parse_mode='Markdown'
        )
        return BULK_UPLOAD
    
    # 1. Download the spreadsheet file temporarily
    temp_spreadsheet_path = os.path.join(IMAGE_STORAGE_PATH, f"bulk_temp_{os.urandom(4).hex()}_{file_name}")
    try:
        telegram_file = await context.bot.get_file(file_id)
        await telegram_file.download_to_drive(temp_spreadsheet_path)
    except Exception as e:
        logger.error(f"Error downloading bulk spreadsheet file: {e}")
        await update.message.reply_text("❌ **Error:** Could not download the spreadsheet file from Telegram. Try again.")
        return ConversationHandler.END

    df = None
    try:
        # 2. Read the file using pandas
        if file_name.lower().endswith('.csv'):
            df = pd.read_csv(temp_spreadsheet_path)
        else:
            df = pd.read_excel(temp_spreadsheet_path)

        # 3. Validation and preparation
        required_cols = ['Name', 'Author', 'Description', 'Rating', 'Category', 'Image_URL', 'Download_Link']
        df = df.rename(columns={c: c for c in df.columns})
        missing_cols = [col for col in required_cols if col not in df.columns]
        if missing_cols:
             await update.message.reply_text(
                f"❌ **Error:** The spreadsheet is missing required columns: `{', '.join(missing_cols)}`\n"
                "Please check the column names (must be case-sensitive) and try again.",
                parse_mode='Markdown'
            )
             return BULK_UPLOAD
        
        df = df[required_cols].fillna('')
        
        # 4. Process the data row by row
        total_books = len(df)
        success_count = 0
        failure_list = []
        
        await update.message.reply_text(f"✅ Spreadsheet received! Attempting to process **{total_books}** books...")
        
        for index, row in df.iterrows():
            await update.message.reply_text(f"Started book {index + 1} of {total_books}")
            # --- RENAMING LOGIC ADDED HERE ---
            original_book_name = str(row['Name']).strip()
            book_name = f"{original_book_name} {CHANNEL_USERNAME}"
            # ---------------------------------
            
            image_url = str(row['Image_URL']).strip()
            download_link_ext = str(row['Download_Link']).strip()
            
            local_image_path = None
            local_book_path = None
            
            channel_message_id = None
            book_file_name = None
            book_file_size = None
            
            # --- IMAGE DOWNLOAD LOGIC ---
            if image_url.lower().startswith(('http', 'https')):
                file_ext = os.path.splitext(image_url.split('?')[0])[-1] or '.jpg'
                safe_name = original_book_name.replace(' ', '_').replace('/', '').replace('\\', '')[:50] # Use original name for file path
                image_filename = f"{safe_name}_{os.urandom(4).hex()}{file_ext}"
                local_image_path = os.path.join(IMAGE_STORAGE_PATH, image_filename)
                await update.message.reply_text(f"Downloading image for book {index + 1} of {total_books}")
                try:
                    response = requests.get(image_url, stream=True, timeout=10)
                    response.raise_for_status() 
                    with open(local_image_path, 'wb') as f:
                        for chunk in response.iter_content(chunk_size=8192):
                            f.write(chunk)
                except Exception as e:
                    logger.warning(f"Failed to download image for '{original_book_name}'. Using None for image_path. Error: {e}")
                    local_image_path = None

            # --- BOOK FILE DOWNLOAD & UPLOAD LOGIC ---
            download_link_final = None # Will hold external link if channel upload fails
            await update.message.reply_text(f"Downloading book file for book {index + 1} of {total_books}")
            if download_link_ext.lower().startswith(('http', 'https')):
                try:
                    # Determine local path for book download
                    book_file_ext = os.path.splitext(download_link_ext.split('?')[0])[-1] or '.pdf'
                    book_filename_temp = f"{book_name}{book_file_ext}"
                    local_book_path = os.path.join(IMAGE_STORAGE_PATH, book_filename_temp)
                    
                    # 1. Download the book file
                    book_response = requests.get(download_link_ext, stream=True, timeout=300) 
                    book_response.raise_for_status()
                    
                    with open(local_book_path, 'wb') as f:
                        for chunk in book_response.iter_content(chunk_size=8192):
                            f.write(chunk)
                    
                    # 2. Upload/Forward the file to the channel
                    with open(local_book_path, 'rb') as book_file_stream:
                        forwarded_message = await context.bot.send_document(
                            chat_id=FILE_STORAGE_CHANNEL_ID,
                            document=book_file_stream,
                            # Use the RENAMED book_name for the caption
                            caption=f"Bulk Upload: {book_name} by {row['Author']}" 
                        )
                        
                    # 3. Capture details
                    channel_message_id = forwarded_message.message_id
                    book_file_name = forwarded_message.document.file_name
                    book_file_size = forwarded_message.document.file_size
                    download_link_final = None # Clear external link as channel upload succeeded
                    
                except Exception as e:
                    logger.error(f"Failed to download/upload book for '{book_name}'. Using external link as fallback. Error: {e}")
                    download_link_final = download_link_ext # Keep external link as fallback
                finally:
                    # 4. Delete the locally downloaded book file
                    if local_book_path and os.path.exists(local_book_path):
                        os.remove(local_book_path)
            else:
                 download_link_final = None


            # --- DATA PREPARATION AND VALIDATION ---

            book_data = {
                'name': book_name, # Renamed book name
                'author': str(row['Author']).strip() or 'Unknown',
                'description': str(row['Description']).strip(),
                'rating': float(row['Rating']) if str(row['Rating']).replace('.', '', 1).isdigit() else 0.0,
                'category': str(row['Category']).strip(),
                'image_path': local_image_path,
                'download_link': download_link_final,
                'channel_message_id': channel_message_id, 
                'file_name': book_file_name,
                'file_size': book_file_size,
            }
            await update.message.reply_text(f"Book {index + 1} of {total_books} added to database")
            # Core validation: Must have a Name, and a secure download method (Channel ID OR external Link)
            is_valid_entry = original_book_name and (book_data['channel_message_id'] is not None or book_data['download_link'] is not None)
            
            # If the original name was empty, the entry is invalid
            if not original_book_name:
                is_valid_entry = False

            if not is_valid_entry:
                 failure_list.append(f"Row {index+2}: Missing Original Name or failed to secure download.")
                 # Clean up local image if failed validation
                 if local_image_path and os.path.exists(local_image_path):
                     os.remove(local_image_path)
                 continue
            
            # Check if category is valid
            if book_data['category'] not in [data for _, data in CATEGORIES]:
                failure_list.append(f"Row {index+2}: Invalid Category '{book_data['category']}'.")
                # Clean up local image if failed category check
                if local_image_path and os.path.exists(local_image_path):
                    os.remove(local_image_path)
                continue
                
            # 5. Add to DB
            if add_book_to_db(book_data):
                success_count += 1
            else:
                failure_list.append(f"Row {index+2} ({book_name}): Database insert failed.")
                # Clean up local image if failed DB insert
                if local_image_path and os.path.exists(local_image_path):
                    os.remove(local_image_path)
                
        # 6. Final Report
        report = (
            f"🎉 **Bulk Upload Complete!** 🎉\n\n"
            f"Total Rows Processed: **{total_books}**\n"
            f"Books Successfully Added: **{success_count}**\n"
            f"Failures: **{len(failure_list)}**"
        )
        
        if failure_list:
            report += "\n\n**Details of Failures (Max 5 shown):**\n"
            report += '\n'.join(failure_list[:5])
            if len(failure_list) > 5:
                 report += f"\n... and {len(failure_list) - 5} more."

        await update.message.reply_text(report, parse_mode='Markdown')

    except Exception as e:
        logger.error(f"Error processing spreadsheet: {e}")
        await update.message.reply_text(f" **Error:** An unexpected error occurred while reading the file: `{e}`")
    finally:
        # Clean up the temporary spreadsheet file
        if os.path.exists(temp_spreadsheet_path):
            os.remove(temp_spreadsheet_path)
            
        return ConversationHandler.END

async def bulk_upload_cancel(update: Update, context: ContextTypes.DEFAULT_TYPE) -> int:
    """Cancels and ends the bulk upload conversation."""
    await update.message.reply_text('Bulk upload cancelled.')
    return ConversationHandler.END

# ----------------------------------------------------------------------------------------------------------------------------------------------------------------

# --- MAIN FUNCTION (list_books, start, check_membership_for_all_messages, handle_callback are omitted for brevity) ---

async def check_membership_for_all_messages(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    """Checks membership for all general messages."""
    # (Implementation omitted for brevity)
    user_id = update.effective_user.id
    if not await is_member(user_id, context):
        await start(update, context) # Re-send the access required message
    # If they are a member, the message is ignored since it's not a command.

async def start(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    """Handles the /start command, checking membership and deep-link payload."""
    user_id = update.effective_user.id
    
    if not await is_member(user_id, context):
        keyboard = [
            [InlineKeyboardButton("📢 Join Channel", url=f"https://t.me/{CHANNEL_USERNAME.replace('@', '')}")],
            [InlineKeyboardButton("🔄 I've Joined - Refresh", callback_data="refresh_membership")]
        ]
        reply_markup = InlineKeyboardMarkup(keyboard)
        safe_channel_username = CHANNEL_USERNAME.replace('_', r'\_').replace('*', r'\*').replace('`', r'\`')
        
        await update.message.reply_text(
            f"🚫 **Access Required** 🚫\n\n"
            f"Welcome to the Book Bot! 📚\n\n"
            f"To use this bot and access all books, you must join our channel:\n**{safe_channel_username}**\n\n"
            f"Please join the channel using the button below, then click 'I've Joined - Refresh' to verify.",
            reply_markup=reply_markup,
            parse_mode='Markdown'
        )
        return
    
    # Handle Deep Linking
    if context.args:
        payload = context.args[0]
        try:
            book_id = int(payload)
        except ValueError:
            await update.message.reply_text("Invalid book code provided. Use /list to see all books.")
            return
        
        book = get_book_details(book_id) 

        if not book:
            await update.message.reply_text("Book not found.")
            return

        book_caption = f"📚 {book['name']} by {book['author']}\n" \
                       f"Category: {book.get('category', 'N/A')}\n" \
                       f"Size: {format_size(book.get('file_size'))}\n\n" \
                       f"Enjoy your reading!"

        if book.get('channel_message_id'):
            # Book is stored in Telegram Channel
            try:
                await context.bot.copy_message(
                    chat_id=update.effective_chat.id,
                    from_chat_id=FILE_STORAGE_CHANNEL_ID,
                    message_id=book['channel_message_id'],
                    caption=book_caption,
                )
            except Exception as e:
                logger.error(f"Failed to copy book from channel: {e}")
                await update.message.reply_text("❌ Error downloading the book from channel. Please try again later.")
        elif book.get("download_link"):
            # Book is stored via external link
            await update.message.reply_text(
                f"🔗 **Download Link for {book['name']}**:\n{book['download_link']}",
                parse_mode='Markdown',
                disable_web_page_preview=True
            )
        else:
             await update.message.reply_text("❌ Book entry is incomplete or download link is missing.")

    else:
        # Standard /start message
        await update.message.reply_text(
            "📚 Welcome to the Book Bot! 📚\n\n"
            "Use /list to see all available books."
        )
async def handle_callback(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    """Handles all inline keyboard button presses."""
    query = update.callback_query
    await query.answer()
    
    user_id = query.from_user.id
    if not await is_member(user_id, context):
        # The bot should send the start message to the chat, not the query
        await context.bot.send_message(
            chat_id=user_id,
            text="🚫 You must join the channel to continue. Please see the /start message for details."
        )
        return

    if query.data.startswith('list_'):
        page = int(query.data.split('_')[1])
        context.args = [str(page)]
        await list_books(update, context)

    if query.data.startswith('detail_'):
        book_id = int(query.data.split('_')[1])
        book = get_book_details(book_id)

        if book:
            caption = (
                f"📖 **{book['name']}**\n"
                f"✍️ **Author:** {book['author']}\n"
                f"🏷️ **Category:** {book.get('category', 'N/A')}\n"
                f"⭐️ **Rating:** {book.get('rating', 'N/A')}\n"
                f"📦 **Size:** {format_size(book.get('file_size'))}\n\n"
                f"**Description:**\n{book['description']}"
            )
            
            # Create a Deep Link URL
            deep_link_url = f"https://t.me/{context.bot.username}?start={book_id}"
            
            download_keyboard = [[InlineKeyboardButton("⬇️ Get Book (Deep Link)", url=deep_link_url)]]
            reply_markup = InlineKeyboardMarkup(download_keyboard)

            if book.get('image_path') and os.path.exists(book['image_path']):
                try:
                    # Send with local image
                    with open(book['image_path'], 'rb') as image_file:
                        await context.bot.send_photo(
                            chat_id=query.message.chat_id,
                            photo=image_file,
                            caption=caption,
                            reply_markup=reply_markup,
                            parse_mode='Markdown'
                        )
                except Exception as e:
                    logger.error(f"Failed to send photo for book {book_id}: {e}")
                    # Fallback to text message if image fails
                    await query.message.reply_text(caption, reply_markup=reply_markup, parse_mode='Markdown')
            else:
                 # Send without image
                await query.message.reply_text(caption, reply_markup=reply_markup, parse_mode='Markdown')
        else:
            await query.message.reply_text("Book details not found.")

    elif query.data == "refresh_membership":
        # Check membership again
        if await is_member(user_id, context):
            await context.bot.edit_message_text(
                chat_id=query.message.chat_id,
                message_id=query.message.message_id,
                text="✅ **Membership Confirmed!** You now have access. Use /list to see all books.",
                parse_mode='Markdown'
            )
        else:
            await context.bot.edit_message_text(
                chat_id=query.message.chat_id,
                message_id=query.message.message_id,
                text="❌ **Verification Failed.** Please ensure you have joined the channel, then try again.",
                parse_mode='Markdown'
            )
async def list_books(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    """Lists available books with pagination."""
    user_id = update.effective_user.id
    if not await is_member(user_id, context):
        await start(update, context)
        return

    # Determine current page (default to 0)
    page = 0
    if context.args and context.args[0].isdigit():
        page = int(context.args[0])

    books = get_all_books()
    if not books:
        await update.message.reply_text("No books have been added yet.")
        return

    items_per_page = 10
    total_pages = (len(books) + items_per_page - 1) // items_per_page
    
    # Slice the list for the current page
    start_idx = page * items_per_page
    end_idx = start_idx + items_per_page
    current_items = books[start_idx:end_idx]

    keyboard = []
    for book in current_items:
        # Each book gets a button for details
        keyboard.append([InlineKeyboardButton(f"📖 {book['name']}", callback_data=f"detail_{book['id']}")])

    # Pagination buttons
    nav_buttons = []
    if page > 0:
        nav_buttons.append(InlineKeyboardButton("⬅️ Back", callback_data=f"list_{page - 1}"))
    
    # Add page indicator
    nav_buttons.append(InlineKeyboardButton(f"{page + 1}/{total_pages}", callback_data="noop"))
    
    if end_idx < len(books):
        nav_buttons.append(InlineKeyboardButton("Next ➡️", callback_data=f"list_{page + 1}"))
    
    if nav_buttons:
        keyboard.append(nav_buttons)

    reply_markup = InlineKeyboardMarkup(keyboard)
    
    text = f"📚 **Available Books (Page {page + 1})**\nClick a book to see details and download."
    
    if update.callback_query:
        await update.callback_query.edit_message_text(text, reply_markup=reply_markup, parse_mode='Markdown')
    else:
        await update.message.reply_text(text, reply_markup=reply_markup, parse_mode='Markdown')
def main():
    """Starts the bot."""
    application = Application.builder().token(TOKEN).get_updates_connect_timeout(10.0).get_updates_read_timeout(60.0).build()

    # Conversation Handler for adding a single book
    add_book_handler = ConversationHandler(
        entry_points=[CommandHandler("addbook", add_book_start)],
        states={
            NAME: [MessageHandler(filters.TEXT & ~filters.COMMAND, get_name)],
            DESCRIPTION: [MessageHandler(filters.TEXT & ~filters.COMMAND, get_description)],
            AUTHOR: [MessageHandler(filters.TEXT & ~filters.COMMAND, get_author)],
            RATING: [MessageHandler(filters.TEXT & ~filters.COMMAND, get_rating)],
            CATEGORY: [CallbackQueryHandler(get_category)], 
            IMAGE: [MessageHandler(filters.PHOTO, get_image)],
            DOWNLOAD: [MessageHandler(filters.TEXT | filters.Document.ALL, get_download)],
        },
        fallbacks=[CommandHandler("cancel", cancel)],
        per_message=False 
    )
    
    # Conversation Handler for bulk book addition
    bulk_upload_handler = ConversationHandler(
        entry_points=[CommandHandler("bulk_add", bulk_upload_start)],
        states={
            BULK_UPLOAD: [MessageHandler(filters.Document.ALL, handle_spreadsheet)],
        },
        fallbacks=[CommandHandler("cancel", bulk_upload_cancel)],
        per_message=False 
    )

    # Command Handlers
    application.add_handler(CommandHandler("start", start))
    application.add_handler(CommandHandler("list", list_books))
    
    # Conversation Handlers
    application.add_handler(add_book_handler)
    application.add_handler(bulk_upload_handler)
    
    # Global membership check for all non-command messages
    application.add_handler(MessageHandler(filters.ALL & ~filters.COMMAND, check_membership_for_all_messages))
    
    # Callback Query Handler (Handles detail_ and refresh_membership)
    application.add_handler(CallbackQueryHandler(handle_callback))

    # Run the bot
    print("Bot is starting...")
    application.run_polling()

if __name__ == '__main__':
    main()