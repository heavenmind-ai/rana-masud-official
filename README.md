# Rana Masud - Official Portfolio & CMS Website

An elegant, fully-featured Next.js web application and content management system (CMS) built to showcase the professional work, filmography, awards, and gallery of film director, producer, and teacher **Rana Masud**.

## 🚀 Technologies

- **Frontend**: Next.js App Router, React, TailwindCSS, Lucide Icons, React Markdown
- **Backend & Database**: MongoDB via Mongoose ORM
- **Object Storage**: Cloudflare R2 (for large media files) with local directory uploads fallback (for assets <= 1MB)
- **Styling**: Vanilla CSS custom variables mixed with modern dark-mode utility classes for a glassmorphism aesthetic

---

## 🛠️ Features

### 1. Dynamic Public Pages
All page contents are dynamically fetched from the database, fully styled with premium typography, fluid animations, and responsiveness:
- **Home**: Dynamic hero slideshow, portfolio summary cards, and client logo marquee.
- **Biography**: Interactive timeline view, professional affiliations, role cards, and notable work tables.
- **Filmography**: Grid showcase of directed films with cast/crew summaries, selections, and IMDb integrations.
- **Awards**: Dedicated laurel list detailing events, locations, and achievements.
- **Festivals**: Split national and international screening directories.
- **Gallery**: Photo gallery with categories, custom title descriptors, and modal lightboxes.
- **Press & TV Shows**: Newspaper clipping grids, external articles list, and embedded YouTube show archives.
- **Contact**: Secure query form with dynamic configurations.

### 2. Powerful Administrative CMS Panel (`/admin`)
An advanced management system accessible via authenticated sessions to control the entire site's copy and visuals:
- **Live State Editing**: Add, remove, and reorder nested documents (e.g. film credits, timeline rows, gallery entries).
- **R2 Media Uploads**: High-speed upload integration direct to bucket storage.
- **Inbox Management**: Review user-submitted contact inquiries, toggle read status, and manage notification copy emails.

### 3. Dynamic SEO Control System
- **Admin Side Panel**: Integrated `<SEOControl />` component in all admin pages with focus keyword lists, optimal length character counters, and Open Graph image banners.
- **Next.js dynamic metadata**: Real-time generation of SEO meta tags (`title`, `description`, `keywords`, `openGraph`) based on values synced from MongoDB.

---

## 📦 Getting Started

### Prerequisites

- Node.js (v18 or higher recommended)
- MongoDB Database URI
- Cloudflare R2 Bucket credentials (optional, falls back to local storage)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/heavenmind-ai/rana-masud-official.git
   cd rana-masud-official
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables. Create a `.env.local` file in the root directory:
   ```env
   # MongoDB URI
   MONGODB_URI=your_mongodb_connection_string

   # Cloudflare R2 Configurations (Optional)
   R2_ENDPOINT=https://your-account-id.r2.cloudflarestorage.com
   R2_ACCESS_KEY_ID=your_access_key_id
   R2_SECRET_ACCESS_KEY=your_secret_access_key
   R2_BUCKET_NAME=your_bucket_name
   R2_PUBLIC_URL=https://pub-your-public-url.r2.dev
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) to see the site.

### Deployment & Production Build

To build the project for production:
```bash
npm run build
npm run start
```

---

## 📂 Project Structure

```
├── src/
│   ├── app/                     # Next.js App Router pages and APIs
│   │   ├── (public)/            # Public-facing portfolio pages
│   │   ├── admin/               # Admin panel pages & editors
│   │   └── api/                 # Database, contact, & upload API routes
│   ├── components/              # Shared client/server React components
│   ├── lib/                     # Database client & content helper systems
│   └── models/                  # Mongoose data schemas (Page, GlobalSettings, etc.)
├── public/                      # Static assets & local uploads fallback
├── package.json                 # Project dependencies & script keys
└── tsconfig.json                # TypeScript configurations
```

---

## 📄 License

This project is licensed under the MIT License. See [LICENSE](LICENSE) for details.
