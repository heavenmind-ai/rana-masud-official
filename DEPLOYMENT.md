# 🚀 Deployment Guide

This document covers how to deploy the Rana Masud Official site on different hosting platforms.

> The project uses **Next.js 16 with `output: "standalone"`**, which bundles all dependencies into a single portable folder — making it easy to deploy on any Node.js-capable server.

---

## 📋 Environment Variables

Set these on your hosting platform before starting the app.

```env
# Required — MongoDB connection string (MongoDB Atlas recommended)
MONGODB_URI=mongodb+srv://<user>:<password>@<cluster>.mongodb.net/<dbname>

# Required — Secret key for signing JWT session tokens
JWT_SECRET=your-super-secret-key-min-32-chars

# Required — Public URL of the site (used for SEO metadata)
NEXT_PUBLIC_SITE_URL=https://yourdomain.com

# Optional — Cloudflare R2 storage (falls back to local /public/content/uploads/)
R2_ACCOUNT_ID=your-cloudflare-account-id
R2_ACCESS_KEY_ID=your-r2-access-key-id
R2_SECRET_ACCESS_KEY=your-r2-secret-access-key
R2_BUCKET_NAME=your-bucket-name
R2_PUBLIC_URL=https://pub-xxxxxxxx.r2.dev

# Optional — SMTP credentials for the contact form (Nodemailer)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your@email.com
SMTP_PASS=your-app-password
```

---

## 🖥️ Option 1: cPanel (Recommended for Shared Hosting)

> **Requirement:** Your cPanel host must have **"Setup Node.js App"** in the dashboard.
> Hosts that support this: A2 Hosting, SiteGround, Namecheap (EasyWP excluded), Hostinger Business+.

### Step 1 — Build Locally

```bash
# Install dependencies
yarn install

# Build the project (generates .next/standalone/)
yarn build
```

### Step 2 — Prepare the Upload Package

```bash
# Copy the standalone build + required assets into one folder
cp -r .next/standalone ./cpanel-upload
cp -r .next/static    ./cpanel-upload/.next/static
cp -r public          ./cpanel-upload/public

# Zip it for upload
zip -r cpanel-upload.zip cpanel-upload/ -x "*.DS_Store"
```

### Step 3 — Upload to cPanel

1. Log in to cPanel → **File Manager**
2. Navigate to your desired folder (e.g. `/home/username/rana-masud/`)
3. Upload `cpanel-upload.zip` and click **Extract**

Your server folder should look like:
```
/home/username/rana-masud/cpanel-upload/
├── server.js          ← Node.js entry point
├── node_modules/      ← Auto-bundled by standalone build
├── .next/
│   └── static/        ← CSS, JS chunks, fonts
├── public/            ← Images and static files
└── package.json
```

### Step 4 — Configure Node.js App in cPanel

1. cPanel → **"Setup Node.js App"** → **"Create Application"**
2. Fill in the form:

| Field | Value |
|---|---|
| Node.js version | `20.x` (or highest available) |
| Application mode | `Production` |
| Application root | `/home/username/rana-masud/cpanel-upload` |
| Application URL | `yourdomain.com` |
| Application startup file | `server.js` |

3. Click **Create**

### Step 5 — Set Environment Variables

In the Node.js App panel → add each variable from the [Environment Variables](#-environment-variables) section above.

### Step 6 — Start & Enable SSL

1. Click **"Start"** (or **"Restart"**) in the Node.js App panel
2. cPanel → **"Let's Encrypt SSL"** → issue a free certificate for your domain
3. Visit your domain — the site is live! ✅

---

## 🚂 Option 2: Railway.app (Easiest — No Code Changes Needed)

> Zero-config deployment. Railway detects Next.js automatically.

1. Create an account at [railway.app](https://railway.app)
2. New Project → **Deploy from GitHub repo**
3. Select this repository
4. Go to **Variables** tab → add all environment variables
5. Railway builds and deploys automatically on every push
6. Add your custom domain in **Settings → Domains**

**Cost:** ~$5/month | **Deploy time:** ~5 minutes

---

## 🐧 Option 3: VPS / Hetzner / DigitalOcean

> Best for full control and lowest long-term cost.

```bash
# On your server — install Node.js 20
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2 (process manager — keeps your app alive)
npm install -g pm2

# Clone and build
git clone https://github.com/heavenmind-ai/rana-masud-official.git
cd rana-masud-official
yarn install
yarn build

# Copy standalone assets
cp -r .next/standalone ./deploy
cp -r .next/static ./deploy/.next/static
cp -r public ./deploy/public

# Create .env file in deploy/
nano deploy/.env
# (paste all your environment variables)

# Start with PM2
pm2 start deploy/server.js --name "rana-masud"
pm2 save
pm2 startup

# Install Nginx and configure reverse proxy
sudo apt install nginx
# Proxy port 3000 → 80/443
```

Configure Nginx:
```nginx
server {
    server_name yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Then enable SSL:
```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com
```

**Cost:** ~$4–6/month (Hetzner CX21 or DigitalOcean Droplet)

---

## 🐛 Troubleshooting

| Problem | Cause | Fix |
|---------|-------|-----|
| App crashes on start | Missing `MONGODB_URI` | Set env variable and restart |
| 404 on all pages | Wrong startup file | Startup file must be `server.js` |
| CSS/images missing | `.next/static` not uploaded | Copy `static/` folder manually |
| Memory crash | Host RAM too low | Upgrade to plan with ≥512MB RAM |
| App stops after inactivity | Shared host kills idle processes | Use PM2 or ask host about keep-alive |
| "Cannot find module" | Incomplete standalone folder | Rebuild and re-upload |

---

## 🔄 Re-deploying After Code Changes

```bash
# 1. Make your changes locally
# 2. Build
yarn build

# 3. Re-prepare upload folder
rm -rf cpanel-upload
cp -r .next/standalone ./cpanel-upload
cp -r .next/static ./cpanel-upload/.next/static
cp -r public ./cpanel-upload/public

# 4. Zip and re-upload to cPanel (replace old files)
zip -r cpanel-upload.zip cpanel-upload/
```

> **Note:** `cpanel-upload/` and `cpanel-upload.zip` are in `.gitignore` — they will never be committed to the repository.
