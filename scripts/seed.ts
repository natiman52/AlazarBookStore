import { PrismaClient } from "../prisma/generated/prisma/client";
import { config } from "dotenv";

// Load environment variables
config();

const prisma = new PrismaClient();

// Helper function to generate slug from book name and author
function generateSlug(name: string, author: string): string {
  const nameSlug = name.toLowerCase().replace(/\s+/g, '-');
  const authorSlug = author.toLowerCase().replace(/\s+/g, '-');
  return nameSlug + authorSlug;
}

const booksDataFinal = {
  "books": [
    {
      "id": 7,
      "name": "Fenote Selam (Path to Peace)",
      "author": "Yiasu Wolde Giorgis",
      "description": "Published in 2001 E.C. (Ethiopian Calendar), this is a crime-science fiction novel created by Fana Yiasu Wolde Giorgis. This novel is one of the top fifty-five best novels chosen by Ethiopian readers. This book has eight parts (fifty-five in the year of the lion). It covers fantasy, modern, political, economic... topics. Fenote Selam is one of the Ethiopian works cited primarily among the classic Ethiopian science fiction works.",
      "rating": 10.0,
      "download_link": null,
      "category": "Ethiopian Fiction",
      "file_size": 6534804,
      "image_path": "/home/nahom/Alazarbot/AlazarBookStore/public/book_images/ፍኖተ ሰላም_bfc99b03.jpg",
      "channel_message_id": 10,
      "file_name": "ፍኖተ ሰላም @Yemesahft_Alem.pdf",
      "downloads": 53
    },
    {
      "id": 8,
      "name": "Amed (Ashes)",
      "author": "Dawit Tsahai Ayalew",
      "description": "....",
      "rating": 10.0,
      "download_link": null,
      "category": "Ethiopian Fiction",
      "file_size": 59453699,
      "image_path": "/home/nahom/Alazarbot/AlazarBookStore/public/book_images/አመድ_eb0412eb.jpg",
      "channel_message_id": 11,
      "file_name": "አመድ @Yemesahft_Alem.pdf",
      "downloads": 12
    },
    {
      "id": 9,
      "name": "Merbebt (The Net)",
      "author": "Girmaye Wolde Giorgis",
      "description": "The Net of Love (Merbebt Yefiker) prepared by Girmaye Wolde Giorgis.",
      "rating": 10.0,
      "download_link": null,
      "category": "Ethiopian Fiction",
      "file_size": 1478477,
      "image_path": "/home/nahom/Alazarbot/AlazarBookStore/public/book_images/መርበብት_የፍቅር_05f5ea40.jpg",
      "channel_message_id": 12,
      "file_name": "መርበብት_የፍቅር_በግርማዬ_ወልደ_ጊዮርጊስ_@Yemesahft_Alem.pdf",
      "downloads": 12
    },
    {
      "id": 10,
      "name": "The Alchemist",
      "author": "PAULO COELHO",
      "description": "The Alchemist follows a young shepherd named Santiago who journeys across deserts and challenges to pursue his dream of finding treasure. Along the way, he learns that true wealth comes from following your heart and discovering your purpose",
      "rating": 10.0,
      "download_link": null,
      "category": "Ethiopian Fiction",
      "file_size": 1102910,
      "image_path": "/home/nahom/Alazarbot/AlazarBookStore/public/book_images/The_Alchemist_25a2f918.jpg",
      "channel_message_id": 13,
      "file_name": "THE-ALCHEMIST @Yemesahft_Alem.pdf",
      "downloads": 12
    },
    {
      "id": 11,
      "name": "Moteregna Lij (The Motorized Boy)",
      "author": "Nebiyu Melke",
      "description": "...",
      "rating": 9.0,
      "download_link": null,
      "category": "Psychology",
      "file_size": 37555334,
      "image_path": "/home/nahom/Alazarbot/AlazarBookStore/public/book_images/ሞተረኛዉ_ልጅ_f60e607c.jpg",
      "channel_message_id": 14,
      "file_name": "ሞተረኛዉ ልጅ @Yemesahft_Alem.pdf",
      "downloads": 11
    },
    {
      "id": 12,
      "name": "Y'an Frank Mastawesha (Anne Frank's Diary)",
      "author": "Anne Frank",
      "description": "\"Anne Frank's Diary photocopy\" is one of the most widely read and world-shaking testimonies of its time. In the book, she gives a profound insight into the war, genocide, Nazi cruelty, the longing for freedom, the strength of spirit, and the value of humanity.",
      "rating": 10.0,
      "download_link": null,
      "category": "Biography",
      "file_size": 14545058,
      "image_path": "/home/nahom/Alazarbot/AlazarBookStore/public/book_images/የአን_ፍራንክ_ማስታወሻ_693d44f5.jpg",
      "channel_message_id": 15,
      "file_name": "የአን ፍራንክ ማስታወሻ @Yemesahft_Alem.pdf",
      "downloads": 10
    },
    {
      "id": 13,
      "name": "Adwa Ye",
      "author": "Abne Mahtem",
      "description": "“Adwa Ye” is an essay written by Fana Abne Mahtem in 1955 E.C. (Ethiopian Calendar). After the author came to America in 1966 E.C., he published the book 'Adwa Ye' which was written in Addis Ababa in 1967 E.C. Furthermore, the book examines the young adulthood, bravery, longing for freedom of Ethiopian students, the extent to which students can influence a country, and their contrast to hatred and conflict. The book is emotionally moving.",
      "rating": 10.0,
      "download_link": null,
      "category": "Ethiopian Fiction",
      "file_size": 4708096,
      "image_path": "/home/nahom/Alazarbot/AlazarBookStore/public/book_images/አድዋየ_8011ae4c.jpg",
      "channel_message_id": 16,
      "file_name": "አድዋየ @Yemesahft_Alem.pdf",
      "downloads": 11
    },
    {
      "id": 14,
      "name": "Atomic habits",
      "author": "James Clear",
      "description": "Atomic Habits by James Clear is a powerful guide on how small daily changes can lead to remarkable long-term results.",
      "rating": 10.0,
      "download_link": null,
      "category": "Psychology",
      "file_size": 6150949,
      "image_path": "/home/nahom/Alazarbot/AlazarBookStore/public/book_images/Atomic_habits_16976850.jpg",
      "channel_message_id": 17,
      "file_name": "Atomic Habits @Yemesahft_Alem.pdf",
      "downloads": 11
    },
    {
      "id": 15,
      "name": "Lib Weled (Novel)",
      "author": "Lij Leul Wolde Giorgis",
      "description": "...",
      "rating": 10.0,
      "download_link": null,
      "category": "Ethiopian Fiction",
      "file_size": 37079254,
      "image_path": "/home/nahom/Alazarbot/AlazarBookStore/public/book_images/ልብ_ወለድ_248e0e31.jpg",
      "channel_message_id": 18,
      "file_name": "ልብ ወለድ@Yemesahft_Alem.pdf",
      "downloads": 11
    }
  ]
};
async function main() {
  console.log("Starting to seed database...");

  for (const book of booksDataFinal.books) {
    try {
      const slug = generateSlug(book.name, book.author);
      await prisma.books.create({
        data: {
          name: book.name,
          author: book.author,
          category: book.category,
          description: book.description,
          rating: book.rating,
          file_size: book.file_size,
          downloads: book.downloads,
          image_path: book.image_path,
          file_name:book.file_name,
          channel_message_id:book.channel_message_id,
          download_link: book.download_link,
          slug: slug,
        },
      });
      console.log(`✓ Added: ${book.name} by ${book.author} (slug: ${slug})`);
    } catch (error) {
      console.error(`✗ Error adding ${book.name}:`, error);
    }
  }

  console.log("\nSeeding blogs...");
  const blogsData = [
    {
      title: "The Future of Reading",
      content: "Reading is evolving with technology. From e-books to audiobooks, the way we consume literature is changing. However, the core essence of storytelling remains the same. In this digital age, accessibility to books has increased, allowing more people to enjoy the wonders of reading.",
      author: "Natnael",
      image_path: "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?auto=format&fit=crop&q=80&w=2070",
    },
    {
      title: "Top 10 Ethiopian Books",
      content: "Ethiopian literature is rich and diverse, with a long history of storytelling. From 'Fikir Eske Mekabir' to 'Oromay', these books offer a glimpse into the culture, history, and soul of Ethiopia. In this post, we explore the top 10 must-read Ethiopian books that have shaped the literary landscape.",
      author: "Alazar",
      image_path: "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&q=80&w=2098",
    },
    {
      title: "Why Printed Books Still Matter",
      content: "In a digital age, the tactile experience of a book is irreplaceable. The smell of paper, the sound of turning pages, and the weight of a book in your hand create a unique connection. Printed books offer a respite from screens and a chance to disconnect and truly immerse oneself in a story.",
      author: "BookLover",
      image_path: "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&q=80&w=2070",
    }
  ];

  for (const blog of blogsData) {
    const slug = blog.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    try {
      await prisma.blog.create({
        data: {
          title: blog.title,
          content: blog.content,
          author: blog.author,
          slug: slug,
          image_path: blog.image_path
        }
      });
      console.log(`✓ Added blog: ${blog.title}`);
    } catch (e) {
      console.error(`✗ Error adding blog ${blog.title}:`, e);
    }
  }

  console.log("\nSeeding completed!");
}

main()
  .catch((e) => {
    console.error("Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

