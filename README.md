# Alibooks (Alazar Bookstore)
===========================

Alibooks is a small bookstore web application built with Next.js (App Router), Prisma, and Tailwind CSS. It provides browsing and searching of books, category filters, a sidebar with top-rated books, and simple support/analytics integrations.

## Key features
- Browse books with pagination and "load more"
- Search by title, author, and description
- Category filters and sidebar with best books and random picks
- Image storage under public/book_images
- Google Analytics and ads script integration

## Tech stack
- Next.js (App Router)
- TypeScript
- Prisma ORM (configure DATABASE_URL)
- Tailwind CSS
- Node.js

## Quick start
1. Install dependencies:
   npm install
2. Configure environment:
   - Set DATABASE_URL and BASE_URL in .env
   - (Optional) Set GA ID or other keys used in layout
3. Generate Prisma client and run migrations:
   npx prisma generate
   npx prisma migrate dev
4. Run the dev server:
   npm run dev

## Project layout
- app/ — Next.js pages and components (Header, Footer, FilterBar, LoadMore, Sidebar)
- prisma/ — schema and migrations
- public/book_images — downloaded book images
- alibooks/app/layout.tsx — global layout and analytics

## Contributing
Open issues or PRs for fixes and small features. Keep changes minimal and documented.

## License

MIT

