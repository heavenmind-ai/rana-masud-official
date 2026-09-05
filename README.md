# Rana Masud — Official Portfolio & CMS Website

An elegant, high-performance Next.js web application and content management system (CMS) built to showcase the professional work, filmography, awards, and gallery of award-winning film director, producer, and teacher **Rana Masud**.

---

## 🚀 Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | Next.js 16 (App Router with Turbopack), React 19, TypeScript |
| **Styling** | Tailwind CSS v4, custom CSS variables, dark-mode glassmorphism |
| **Database** | MongoDB via Mongoose ODM |
| **Object Storage** | Cloudflare R2 (S3-compatible via `@aws-sdk/client-s3`) |
| **Email System** | Nodemailer (SMTP / cPanel Mail) |
| **Authentication** | Custom HMAC-SHA256 signed JWT sessions + client-side Remember Me |
| **Icons & Media** | Lucide React, YouTube embed player, modal lightboxes |
| **Blog & Content** | gray-matter + react-markdown |

---

## ✨ Key Features

### 1. Dynamic Public Pages
All public pages are pre-rendered and globally cached via **On-Demand ISR (Incremental Static Regeneration)** for ultra-fast load times and low serverless compute:
- **Home** — Cinematic hero video/photo slideshow, services showcase, notable films, festival laurels marquee, client brand logos.
- **Biography** — Interactive career timeline, professional affiliations, academic teaching roles at Bangladesh Film Institute (BFI).
- **Filmography** — Directed films showcase with cast/crew summaries, selections, and IMDb integrations.
- **Awards** — Complete laurel list detailing festival honors, locations, and achievements.
- **Festivals** — Categorized national and international screening directories.
- **Gallery** — Production & behind-the-scenes shoot photo gallery with modal lightbox view.
- **Ad Film** — Commercials, TVCs, and PSAs portfolio with brand logos and video embeds.
- **TV Shows** — Curated television broadcast archive with responsive YouTube video players.
- **Press Coverage** — Media articles, newspaper clippings, and external links.
- **Blog** — Complete article feed with individual markdown post pages.
- **Contact** — Dynamic inquiry form with direct SMTP email forwarding.

### 2. Administrative CMS Panel (`/admin`)
A secure, custom-built management dashboard accessible through authenticated sessions:
- **Remember Me Authentication**: Checkbox to save credentials in `localStorage` for lifetime persistence on client end, accompanied by extended 10-year session tokens.
- **Live Page Editors**: Full WYSIWYG/field control over text, images, and arrays across all public pages.
- **Media Uploads to Cloudflare R2**: Direct file uploads with automatic MD5 hash deduplication.
- **Blog Post Manager**: Create, edit, and delete markdown blog posts.
- **Contact Form Inbox**: Review incoming inquiries, toggle read status, and manage notifications.
- **Website Analytics**: Built-in, privacy-conscious visitor and pageview analytics dashboard with 14-day traffic trendlines, top pages, devices, and browser breakdowns.
- **On-Demand Cache Purging**: Any changes saved in the admin panel instantly revalidate the public pages via `revalidatePath()`.

### 3. SEO & Metadata
- Dynamic metadata generation via `generateMetadata()` for all routes.
- Schema.org JSON-LD structured data (`Person` and `VideoObject` schemas) for rich search engine indexing.
- Dynamic `sitemap.xml` and `robots.txt` generation.
- Edge-level redirects in `next.config.ts` for clean URL structures.

---

## 📦 Getting Started

### Prerequisites
- **Node.js**: v20 or higher recommended
- **Yarn** or **npm**
- **MongoDB Database**: Connection URI (MongoDB Atlas or self-hosted)
- **Cloudflare R2 Bucket**: Account ID, Access Key, Secret Key, and Public URL (for media uploads)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/heavenmind-ai/rana-masud-official.git
   cd rana-masud-official
   ```

2. **Install dependencies:**
   ```bash
   yarn install
   ```

3. **Configure Environment Variables:**
   Copy the example environment template and fill in your values:
   ```bash
   cp .env.example .env
   ```

   **Required variables in `.env`:**
   ```env
   # Database
   MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.xxxxxxx.mongodb.net/<database_name>?retryWrites=true&w=majority

   # Authentication & Security
   JWT_SECRET=your-super-secret-jwt-key-min-32-chars

   # Site Canonical URL
   NEXT_PUBLIC_SITE_URL=https://ranamasudbd.com

   # Cloudflare R2 Storage (for image uploads)
   R2_ACCOUNT_ID=your_cloudflare_account_id
   R2_ACCESS_KEY_ID=your_r2_access_key_id
   R2_SECRET_ACCESS_KEY=your_r2_secret_access_key
   R2_BUCKET_NAME=your_r2_bucket_name
   R2_PUBLIC_URL=https://pub-xxxxxxxxxxxxxxxxxxxxxxxx.r2.dev

   # Contact Form SMTP (cPanel / Gmail / SendGrid)
   SMTP_HOST=mail.ranamasudbd.com
   SMTP_PORT=465
   SMTP_USER=no-reply@ranamasudbd.com
   SMTP_PASS=your_email_password
   SMTP_FROM=no-reply@ranamasudbd.com
   ```

4. **Run Development Server:**
   ```bash
   yarn dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.  
   Admin panel: [http://localhost:3000/admin](http://localhost:3000/admin)

5. **Production Build:**
   ```bash
   yarn build
   yarn start
   ```

---

## 🚢 Deployment

This project is fully optimized for:
- **Vercel (Free / Hobby Tier)**: Uses 24-hour on-demand ISR and throttled beacon analytics to keep serverless function execution well within free tier limits.
- **cPanel (Node.js App)**: Built with `output: "standalone"` compatibility.
- **VPS / Linux (PM2 + Nginx)**: Self-hostable on Hetzner, DigitalOcean, or AWS EC2.

---

## 📂 Project Structure

```
├── src/
│   ├── app/
│   │   ├── (public)/            # Public portfolio pages (Home, Bio, Films, etc.)
│   │   ├── admin/               # Administrative CMS pages & editors
│   │   ├── api/                 # Next.js route handlers (auth, upload, pages, contact, analytics)
│   │   ├── layout.tsx           # Global root HTML layout
│   │   ├── sitemap.ts           # Dynamic XML sitemap generator
│   │   └── robots.ts            # Robots.txt configuration
│   ├── components/              # Reusable React client & server components
│   ├── lib/                     # Auth helpers, MongoDB client, R2 client, content utilities
│   └── models/                  # Mongoose models (Page, GlobalSettings, Message, AnalyticsEvent)
├── public/                      # Static client assets, branding, and local media fallbacks
├── .env.example                 # Comprehensive environment variable reference template
├── next.config.ts               # Next.js configurations & edge redirects
├── package.json                 # Scripts and dependency declarations
└── tsconfig.json                # TypeScript compiler configuration
```

---

## 📄 License

This project is licensed under the MIT License. See [LICENSE](LICENSE) for details.
