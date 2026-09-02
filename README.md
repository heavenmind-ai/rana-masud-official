# Rana Masud — Official Portfolio & CMS Website

An elegant, fully-featured Next.js web application and content management system (CMS) built to showcase the professional work, filmography, awards, and gallery of film director, producer, and teacher **Rana Masud**.

## 🚀 Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | Next.js 16 (App Router), React 19, TypeScript |
| **Styling** | Tailwind CSS v4, custom CSS variables, glassmorphism dark-mode |
| **Database** | MongoDB via Mongoose ODM |
| **Object Storage** | Cloudflare R2 (S3-compatible) — falls back to local `/public/content/uploads/` |
| **Email** | Nodemailer (SMTP) |
| **Auth** | Custom JWT (HS256) — no third-party auth dependencies |
| **Icons** | Lucide React |
| **Markdown** | gray-matter + react-markdown |

---

## ✨ Features

### Public Portfolio Pages
All content is dynamically fetched from MongoDB and fully editable from the admin panel:

- **Home** — Cinematic hero slideshow, services grid, notable films, festival laurels marquee, client logos marquee
- **Biography** — Interactive professional timeline, affiliations, role cards, notable works table
- **Filmography** — Grid showcase with cast/crew details, selections, and IMDb links
- **Awards** — Laurel list with event, location, and achievement details
- **Festivals** — National and international screening directories
- **Gallery** — Photo gallery with categories and modal lightboxes
- **Ad Films** — TVC/PSA portfolio with brand logos
- **Press** — Newspaper clippings, article links
- **TV Shows** — Embedded YouTube archive
- **Blog** — Full markdown blog with individual post pages
- **Contact** — Secure form with SMTP email delivery

### Admin CMS Panel (`/admin`)
A full-featured content management system behind JWT authentication:

- **Live content editing** for all 12+ page sections
- **Nested document management** — add, reorder, and remove entries (films, timeline rows, gallery items, etc.)
- **Media uploads** to Cloudflare R2 storage
- **Blog management** — create, edit, and delete posts with markdown editor
- **Contact inbox** — review submissions, toggle read status
- **SEO controls** — live metadata editor with focus keyword hints and character counters
- **Admin settings** — change email and password securely

### Technical Highlights
- `output: "standalone"` — self-contained build for cPanel and VPS deployment
- Custom middleware for legacy path redirects and crawl-trap cleanup
- Dynamic SEO metadata via `generateMetadata()` synced from MongoDB
- JSON-LD structured data (Person schema) on the homepage
- Dynamic sitemap (`/sitemap.xml`) and robots (`/robots.txt`)
- Analytics tracking model with page-view counting

---

## 📦 Getting Started

### Prerequisites

- Node.js 20+
- MongoDB URI (MongoDB Atlas recommended)
- Cloudflare R2 credentials *(optional — local file fallback available)*

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/heavenmind-ai/rana-masud-official.git
cd rana-masud-official

# 2. Install dependencies
yarn install

# 3. Create environment file
cp .env.example .env.local  # or create manually
```

### Environment Variables

Create a `.env.local` file in the root:

```env
# Required
MONGODB_URI=mongodb+srv://<user>:<password>@<cluster>.mongodb.net/<dbname>
JWT_SECRET=your-super-secret-key-min-32-chars
NEXT_PUBLIC_SITE_URL=https://yourdomain.com

# Optional — Cloudflare R2 Storage
R2_ACCOUNT_ID=your-cloudflare-account-id
R2_ACCESS_KEY_ID=your-r2-access-key-id
R2_SECRET_ACCESS_KEY=your-r2-secret-access-key
R2_BUCKET_NAME=your-bucket-name
R2_PUBLIC_URL=https://pub-xxxxxxxx.r2.dev

# Optional — SMTP for contact form
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your@email.com
SMTP_PASS=your-app-password
```

### Run Locally

```bash
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) — Admin panel at [http://localhost:3000/admin](http://localhost:3000/admin).

### Production Build

```bash
yarn build
yarn start
```

---

## 🚢 Deployment

This project supports deployment on **cPanel (Node.js)**, **Railway**, and **VPS/Linux servers**.

👉 See the full step-by-step guide: **[DEPLOYMENT.md](./DEPLOYMENT.md)**

---

## 📂 Project Structure

```
├── src/
│   ├── app/
│   │   ├── (public)/            # Public portfolio pages
│   │   ├── admin/               # Admin CMS panel (14 sections)
│   │   └── api/                 # REST API routes
│   ├── components/              # Shared React components
│   ├── lib/                     # DB client, auth, content helpers, R2 client
│   └── models/                  # Mongoose schemas (Page, GlobalSettings, Message, Analytics)
├── public/                      # Static assets & local upload fallback
├── DEPLOYMENT.md                # Hosting & deployment guide
├── next.config.ts               # Next.js config (standalone output)
├── package.json
└── tsconfig.json
```

---

## 📄 License

This project is licensed under the MIT License. See [LICENSE](LICENSE) for details.
