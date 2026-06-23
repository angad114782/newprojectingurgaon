# GurgaonRealty — Complete Workflow & Architecture Documentation

> **Site:** [newprojectsingurgaon.com](https://newprojectsingurgaon.com)
> **Stack:** Next.js 14 · Express.js · MongoDB · Socket.io · WhatsApp Cloud API

---

## Table of Contents

1. [Tech Stack](#1-tech-stack)
2. [Project Structure](#2-project-structure)
3. [Quick Start](#3-quick-start)
4. [Environment Variables](#4-environment-variables)
5. [Server Startup Workflow](#5-server-startup-workflow)
6. [Database Models](#6-database-models)
7. [Lead Management Workflow](#7-lead-management-workflow)
8. [OTP System](#8-otp-system)
9. [URL Architecture](#9-url-architecture)
10. [SEO & Indexing Workflow](#10-seo--indexing-workflow)
11. [Admin Panel](#11-admin-panel)
12. [Project CRUD Flow](#12-project-crud-flow)
13. [Image Upload Workflow](#13-image-upload-workflow)
14. [Blog Workflow](#14-blog-workflow)
15. [Notification Services](#15-notification-services)
16. [Real-Time (Socket.io)](#16-real-time-socketio)
17. [Rate Limiting](#17-rate-limiting)
18. [API Reference](#18-api-reference)
19. [Deployment Workflow](#19-deployment-workflow)
20. [E-E-A-T Trust System](#20-e-e-a-t-trust-system)

---

## 1. Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 14 (App Router, TypeScript, Tailwind CSS) |
| Backend | Node.js + Express.js |
| Database | MongoDB (Mongoose ODM) |
| Real-time | Socket.io (WebSocket) |
| Auth | JWT (admin) + OTP (user/lead) |
| Notifications | WhatsApp Cloud API · Nodemailer · Twilio SMS |
| SEO Indexing | Google Indexing API + IndexNow (Bing/Yandex) |
| AI | Anthropic Claude (SEO Intelligence tab) |
| Hosting | VPS · PM2 · nginx (reverse proxy) |

---

## 2. Project Structure

```
gurgaon-realestate/
├── backend/
│   ├── config/
│   │   └── db.js                  # MongoDB connection
│   ├── middleware/
│   │   └── auth.js                # JWT protect + authorize
│   ├── models/
│   │   ├── Project.js             # Real estate listings
│   │   ├── Lead.js                # Visitor tracking + lead capture
│   │   ├── OTP.js                 # Temporary OTP storage
│   │   ├── Blog.js                # Blog posts
│   │   ├── Author.js              # Team members / advisors
│   │   ├── SiteSettings.js        # Global site config
│   │   ├── User.js                # Admin users
│   │   └── IndexingLog.js         # Google/IndexNow submission logs
│   ├── routes/
│   │   ├── leads.js               # Lead tracking, OTP, form submit
│   │   ├── projects.js            # Project CRUD
│   │   ├── admin.js               # Admin auth + dashboard + CSV import
│   │   ├── blogs.js               # Blog CRUD
│   │   ├── authors.js             # Author/team CRUD
│   │   ├── settings.js            # Site settings CRUD
│   │   ├── upload.js              # Image upload (multer)
│   │   ├── indexing.js            # Google Indexing API + IndexNow
│   │   └── ai.js                  # Anthropic Claude AI routes
│   ├── services/
│   │   ├── otpService.js          # OTP generate, send, verify
│   │   ├── whatsappService.js     # WhatsApp Cloud API + automations
│   │   ├── emailService.js        # Nodemailer email templates
│   │   └── indexing.js            # Google Indexing API + IndexNow logic
│   ├── utils/
│   │   ├── seedData.js            # Auto-seed projects, settings, team
│   │   ├── seedBlogs.js           # Seed default blog posts
│   │   └── updateBlogsFAQ.js      # Utility to update blog FAQs
│   └── server.js                  # Entry point — Express + Socket.io + DB
│
└── frontend/
    ├── app/
    │   ├── page.tsx               # Homepage
    │   ├── layout.tsx             # Root layout (fonts, analytics)
    │   ├── sitemap.ts             # Auto-generated sitemap.xml (ISR 1hr)
    │   ├── robots.ts              # Auto-generated robots.txt
    │   ├── [city]/
    │   │   ├── page.tsx           # /bhiwadi, /faridabad etc.
    │   │   └── [slug]/page.tsx    # /bhiwadi/project-name
    │   ├── project/[slug]/page.tsx  # Individual project detail page
    │   ├── corridor/[slug]/page.tsx # Corridor landing page
    │   ├── ready-to-move/[city]/page.tsx
    │   ├── blog/
    │   │   ├── page.tsx           # Blog listing
    │   │   └── [slug]/page.tsx    # Individual blog post
    │   ├── admin/                 # Admin panel (isolated from site layout)
    │   │   ├── layout.tsx
    │   │   ├── page.tsx           # Dashboard
    │   │   ├── projects/page.tsx
    │   │   ├── leads/page.tsx
    │   │   ├── blog/page.tsx
    │   │   ├── team/page.tsx
    │   │   ├── seo-intel/page.tsx
    │   │   ├── indexing/page.tsx
    │   │   ├── settings/page.tsx
    │   │   ├── branding/page.tsx
    │   │   ├── analytics/page.tsx
    │   │   ├── gsc/page.tsx
    │   │   ├── tracking/page.tsx
    │   │   ├── conversion/page.tsx
    │   │   └── profile/page.tsx
    │   ├── about/page.tsx
    │   ├── contact/page.tsx
    │   ├── privacy-policy/page.tsx
    │   ├── terms/page.tsx
    │   ├── disclaimer/page.tsx
    │   └── [30+ static SEO pages]/
    ├── components/
    │   ├── layout/                # Header, Footer, Topbar, StickyButtons
    │   ├── home/                  # HeroSection, FeaturedProjects, HomeSections
    │   ├── project/               # ProjectCard
    │   ├── lead/                  # LeadCTA, OTPModal, TrackingProvider
    │   ├── seo/                   # SchemaMarkup (JSON-LD injectors)
    │   ├── location/              # LocationPageTemplate
    │   └── conversion/            # PsychTriggers (scarcity, countdown, ROI)
    ├── lib/
    │   ├── api-projects.ts        # Project fetch helpers
    │   ├── api-blogs.ts           # Blog fetch helpers
    │   ├── api-authors.ts         # Author fetch helpers
    │   ├── projects.ts            # ALL_SEO_PAGES list + static data
    │   ├── settings.ts            # fetchSettings() helper
    │   └── tracking.ts            # Client-side event tracking
    └── middleware.ts              # Trailing slash 301 redirect
```

---

## 3. Quick Start

### Backend

```bash
cd backend
npm install
cp .env.example .env
# Fill in .env (MongoDB URI, JWT secret, WhatsApp, SMTP, etc.)

npm run dev        # development (nodemon, hot reload)
npm start          # production
```

Backend: `http://localhost:5007`
Health check: `http://localhost:5007/health`

### Frontend

```bash
cd frontend
npm install
cp .env.example .env.local
# Set NEXT_PUBLIC_API_URL and NEXT_PUBLIC_SITE_URL

npm run dev        # development
npm run build      # production build
npm start          # production server
```

Frontend: `http://localhost:3000`

---

## 4. Environment Variables

### Backend (`backend/.env`)

| Variable | Description |
|---|---|
| `MONGODB_URI` | MongoDB Atlas or local connection string |
| `JWT_SECRET` | Secret for admin JWT tokens |
| `PORT` | Server port (default: `5007`) |
| `NODE_ENV` | `development` or `production` |
| `WHATSAPP_TOKEN` | Meta WhatsApp Cloud API access token |
| `WHATSAPP_PHONE_ID` | WhatsApp Business phone number ID |
| `WHATSAPP_VERIFY_TOKEN` | Webhook verification token |
| `SMTP_HOST` | SMTP server host |
| `SMTP_USER` | SMTP email address |
| `SMTP_PASS` | SMTP password |
| `TWILIO_ACCOUNT_SID` | Twilio account SID (OTP SMS fallback) |
| `TWILIO_AUTH_TOKEN` | Twilio auth token |
| `TWILIO_PHONE_NUMBER` | Twilio phone number |

> **Note:** `ANTHROPIC_API_KEY` is stored in MongoDB `SiteSettings` (not in .env) — fetched at runtime from DB to allow admin to update it without redeployment.

### Frontend (`frontend/.env.local`)

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_API_URL` | Backend API URL (e.g., `https://api.newprojectsingurgaon.com/api`) |
| `NEXT_PUBLIC_SITE_URL` | Live site URL (e.g., `https://newprojectsingurgaon.com`) |
| `NEXT_PUBLIC_GA4_ID` | Google Analytics 4 Measurement ID |

---

## 5. Server Startup Workflow

```
npm start  (PM2 process: realestate-backend)
    │
    ├── Create Express app
    ├── Attach Socket.io to HTTP server
    │       └── Admin clients join 'admin-room' on connect
    │
    ├── connectDB() → MongoDB connect
    │
    └── Auto-Seed (runs every startup, idempotent):
            ├── Project.count === 0   → seedProjects()   [20+ real Gurgaon projects]
            ├── Project.count > 0     → seedProjects()   [sync new projects only]
            ├── SiteSettings.count === 0 → seedSettings() [phone, SEO meta, market stats]
            └── Author.count === 0    → seedTeam()       [property advisors]
    │
    └── Listen on 0.0.0.0:5007
```

---

## 6. Database Models

### Project
| Field | Type | Description |
|---|---|---|
| `name`, `slug` | String | Project name + unique URL slug |
| `builder` | Object | name, logo, website, reraId |
| `location`, `sector`, `corridor`, `city` | String | Location hierarchy |
| `status` | Enum | New Launch / Pre Launch / Under Construction / Ready To Move |
| `priceDisplay`, `priceMin`, `priceMax` | String/Number | Price for display + filtering |
| `configurations`, `floorPlans` | Array | BHK configs + floor plan details |
| `rera` | Object | RERA number, link, expiry |
| `highlights`, `amenities`, `connectivity` | Array | Feature lists |
| `heroImage`, `gallery`, `floorPlanImages` | Array | Image URLs |
| `faqs` | Array | `{q, a}` for FAQ schema |
| `description`, `shortDescription` | String | SEO content |

### Lead
| Field | Type | Description |
|---|---|---|
| `visitorId` | String | Anonymous UUID (assigned before form fill) |
| `name`, `mobile`, `email` | String | Contact info |
| `isVerified`, `verifiedAt` | Boolean/Date | OTP verification status |
| `score` | Number | Behavior-based lead score |
| `status` | Enum | Cold / Warm / Hot / Priority / Booked / Lost |
| `buyingPurpose` | Enum | Investment / Self Use / Both |
| `timeline` | Enum | Immediately / 3 Months / 6 Months / Not Decided |
| `whatsappConsent` | Boolean | GDPR-style consent for WA messages |
| `pagesViewed`, `projectsViewed` | Array | Behavior tracking |
| `timeline_events` | Array | Full event history with scores |
| `utmSource/Medium/Campaign` | String | Traffic source attribution |
| `deviceType`, `browser`, `ipAddress` | String | Device info |

### SiteSettings
Global config stored in DB — phone, WhatsApp, email, address, logo, OG image, GA4 ID, market stats, testimonials, builder logos, location cards, corridors.

### Author
Team member / property advisor — name, slug, photo, designation, experience, RERA agent ID, credentials, bio, specializations, education, languages, deals count, social links.

### Blog
Title, slug, excerpt, hero image, category, status (draft/published), author (embedded object), sections `[{heading, content, link}]`, FAQs `[{q, a}]`, related links, keywords, SEO date fields.

### IndexingLog
URL, type (google/indexnow), status (success/failed), response, timestamp.

---

## 7. Lead Management Workflow

```
STEP 1 — Anonymous Visitor Arrives
├── GET /api/leads/visitor-id → generates UUID
└── Frontend stores visitorId in localStorage

STEP 2 — Silent Behavior Tracking
└── POST /api/leads/track  (fires on every user action)
        Event scores:
        ├── page_visit           → +1
        ├── project_view         → +3
        ├── project_revisit      → +5
        ├── price_section_view   → +7
        ├── brochure_click       → +10
        ├── floor_plan_click     → +10
        ├── whatsapp_click       → +12
        ├── call_click           → +15
        └── site_visit_request   → +25

STEP 3 — Auto Lead Status (pre-save hook)
├── Score 0–10   → Cold
├── Score 11–30  → Warm
├── Score 31–60  → Hot
└── Score 61+    → Priority

STEP 4 — OTP Verification (triggered on high-intent action)
├── POST /api/leads/send-otp   → WhatsApp OTP (primary) / SMS / console (dev)
└── POST /api/leads/verify-otp
        ├── Merge visitorId data with lead record
        ├── Mark isVerified = true
        ├── Issue JWT token (30-day expiry) → sent to frontend
        ├── Emit Socket.io 'lead:new' → admin panel real-time alert
        └── Fire-and-forget notifications:
                ├── Email to admin (lead notification)
                ├── Welcome email to user
                ├── WhatsApp to admin
                └── WhatsApp thank-you to user

STEP 5 — CTA Click Tracking
└── POST /api/leads/cta
        CTA types: brochure | price_list | floor_plan | site_visit | whatsapp | call
        └── Score added + WhatsApp automation triggered (if whatsappConsent === true)

STEP 6 — WhatsApp Automation Triggers (post-consent)
├── brochure_requested    → send brochure message
├── price_list_requested  → send pricing details
├── site_visit_confirmed  → send confirmation + directions
├── investment_intent     → send investment pitch (if buyingPurpose = Investment)
├── self_use_intent       → send project details (if buyingPurpose = Self Use)
└── project_revisit       → re-engagement message
```

---

## 8. OTP System

```
POST /api/leads/send-otp
├── Generate 6-digit OTP
├── Upsert OTP collection (replaces existing OTP for same mobile — 1 active OTP)
├── Try WhatsApp Cloud API (primary)
│       └── If WA not configured → Twilio SMS fallback
│               └── If Twilio not set → console.log (DEV MODE — no send)
└── Rate limited: 5 requests / 1 minute

POST /api/leads/verify-otp
├── Check OTP match + 5-minute expiry
├── Mark OTP as isUsed = true
└── Issue JWT: { leadId, visitorId }, 30-day expiry
```

---

## 9. URL Architecture

### Public Pages

```
/                                          Homepage — all projects
/project/[slug]                            Project detail (SSG + ISR)
/[city]                                    City listing — /bhiwadi, /faridabad
/[city]/[slug]                             City project — /bhiwadi/project-name
/ready-to-move/[city]                      RTM projects by city
/corridor/[slug]                           Corridor landing page

Static SEO Pages:
/dwarka-expressway-projects
/golf-course-extension-road-projects
/golf-course-road-projects
/spr-road-projects
/new-gurgaon-projects
/new-projects-in-gurgaon
/new-launch-projects-in-gurgaon
/residential-property-in-gurgaon
/ready-to-move-flats-gurgaon

Budget/BHK Pages:
/flats-under-50-lakh-gurgaon
/flats-under-1-crore-gurgaon
/luxury-apartments-above-3-crore-gurgaon
/2-bhk-flats-in-dwarka-expressway-gurgaon
/3-bhk-flats-in-dwarka-expressway-gurgaon
/3-bhk-flats-golf-course-extension-road-gurgaon
/penthouse-in-gurgaon

Sector Pages:
/sector-102-gurgaon-property
/sector-106-gurgaon-property
/sector-113-gurgaon-property
/sector-37d-gurgaon-property

Blog:
/blog
/blog/[slug]

Trust Pages:
/about  /contact  /privacy-policy  /terms  /disclaimer
```

### Admin Pages

```
/admin                    Dashboard (stats overview)
/admin/projects           Project CRUD + CSV import
/admin/leads              Lead CRM (filter, assign, update)
/admin/blog               Blog CRUD
/admin/team               Author / team management
/admin/seo-intel          AI-powered SEO suggestions (Anthropic)
/admin/indexing           Manual URL submit → Google + IndexNow
/admin/gsc                Google Search Console (linked)
/admin/analytics          GA4 view
/admin/tracking           Pixel / tag management
/admin/branding           Logo, favicon, OG image upload
/admin/settings           Phone, WhatsApp, email, market stats
/admin/conversion         PsychTriggers config
/admin/profile            Admin user profile
```

---

## 10. SEO & Indexing Workflow

### Sitemap (`/sitemap.xml`)
- Auto-generated via `frontend/app/sitemap.ts`
- ISR revalidation: every 1 hour
- Includes: homepage, all static SEO pages, all DB projects (with `updatedAt` timestamp), all published blogs (DB + 5 static fallbacks)

### Image Sitemap (`/image-sitemap.xml`)
- Separate route handler: `frontend/app/image-sitemap.xml/route.ts`

### Robots (`/robots.txt`)
- Auto-generated via `frontend/app/robots.ts`
- Allows all bots on public pages
- Blocks `/admin/*`

### Middleware (`frontend/middleware.ts`)
- Trailing slash removal (301 redirect)
- Applies to all routes except static assets

### Instant Indexing (`POST /api/indexing/submit`)

```
Google Indexing API
├── Build JWT using Service Account JSON (stored in SiteSettings DB)
├── Exchange JWT for OAuth access token
├── POST to googleapis.com/indexing/v3/urlNotifications:publish
│       type: "URL_UPDATED"
└── Log result to IndexingLog collection

IndexNow (Bing / Yandex / DuckDuckGo)
├── IndexNow key file served from /public/<key>.txt
└── POST to api.indexnow.org/indexnow
        └── Submits URL batch with key
```

### Schema Markup (JSON-LD — injected per page)

| Schema | Pages |
|---|---|
| `RealEstateListingSchema` | Project detail pages |
| `FAQSchema` | Project pages + blog posts |
| `BreadcrumbSchema` | All pages |
| `SpeakableSchema` | Voice search / AIO optimization |
| `NeighborhoodSchema` | Location / sector pages |
| `Organization` / `LocalBusiness` | Homepage, About, Contact |
| `Person` | Author pages (E-E-A-T) |

---

## 11. Admin Panel

Admin panel is isolated from the site layout — no site header/footer rendered on `/admin` routes.

### Authentication Flow

```
POST /api/admin/send-otp  → OTP to admin mobile/email
POST /api/admin/login     → verify OTP → JWT token
                            Token stored in admin context (_context.tsx)
All admin API routes:     → middleware: protect() + authorize()
```

### Admin Tabs Summary

| Tab | Function |
|---|---|
| Dashboard | Total leads, new today, hot leads, site visits count |
| Projects | Add / edit / delete projects; CSV bulk import; image upload; corridor manager |
| Leads | Filter by status/score/date; update status; assign to team; add remarks; follow-up date |
| Blog | Create/edit blog with sections + FAQs; publish/draft toggle |
| Team | Add/edit/delete Author profiles (for E-E-A-T) |
| SEO Intel | AI SEO suggestions powered by Anthropic Claude |
| Indexing | Manual submit URLs to Google Indexing API + IndexNow |
| GSC | Google Search Console view |
| Analytics | GA4 traffic dashboard |
| Tracking | GA4 ID, pixel, tag config |
| Branding | Upload logo, footer logo, favicon, OG image, hero image |
| Settings | Edit phone, WhatsApp, email, address, market stats, testimonials, location cards |
| Conversion | PsychTriggers settings (scarcity badges, countdown, ROI calculator) |
| Profile | Update admin user name/password |

---

## 12. Project CRUD Flow

```
Admin → Projects tab → Add/Edit Project
├── Fill form fields (name, slug, builder, location, corridor, city, price, RERA, images)
├── Corridor management (inline):
│       ├── Add new corridor directly from project form dropdown
│       └── Delete corridors via Corridors Manager modal (with city filter)
├── Image upload → POST /api/upload → saved to backend/public/uploads/
│       └── Returned URL stored in project document
└── Save → POST /api/projects (create) or PUT /api/projects/:id (edit)
        └── autoSubmit(projectUrl) → Google Indexing API + IndexNow (auto-index)

CSV Bulk Import:
└── Upload CSV file → Admin parses it server-side
        ├── parseCSV() — handles quoted fields, commas inside quotes
        ├── downloadImageFromUrl() — downloads remote images → saves locally
        └── Bulk upsert projects into MongoDB
```

---

## 13. Image Upload Workflow

```
POST /api/upload
├── multer middleware receives file (max 10MB, memory storage)
├── File saved to: backend/public/uploads/<timestamp>-<random>.<ext>
└── Returns: { url: "/api/uploads/<filename>" }

Static serving:
├── /api/uploads/<file>  →  served by Express static (nginx proxies /api/ → backend)
└── /uploads/<file>      →  also served (backward compatibility)

Cache: 7 days (max-age)
CORS: Access-Control-Allow-Origin: * (for cross-origin image loads)
```

---

## 14. Blog Workflow

```
CREATE / EDIT BLOG  →  Admin → Blog tab
├── Title, slug (auto-generated from title), excerpt, category
├── Hero image (uploaded via /api/upload)
├── Author → linked to Author model (name, photo, credentials)
├── Sections: [{ heading, content, link, linkText }]  ← rich multi-section content
├── FAQs: [{ q, a }]  ← rendered as FAQSchema JSON-LD
├── Related links: [{ label, href }]
├── Keywords, readTime
└── Status: draft (hidden) | published (visible on /blog)

BLOG PAGE  →  /blog/[slug]  (ISR)
├── Fetches from MongoDB (published only)
├── Falls back to 5 built-in static blogs if DB unavailable
├── Renders: FAQSchema + BreadcrumbSchema + Author bio + E-E-A-T signals
└── Static fallback slugs (always in sitemap):
        best-sectors-to-invest-in-gurgaon
        dwarka-expressway-investment-guide
        new-launch-vs-ready-to-move-property
        how-to-check-rera-before-buying-property
        best-builders-in-gurgaon
```

---

## 15. Notification Services

### WhatsApp Cloud API (Meta) — Primary
- OTP delivery to users
- Thank-you message to user after OTP verification
- Admin alert on new verified lead (real-time)
- Automation triggers: brochure, price list, site visit, re-engagement

### Email (Nodemailer / SMTP) — Secondary
- Admin lead notification email (on every new lead)
- User welcome/confirmation email
- OTP delivery fallback (if WA fails)

### Twilio SMS — Fallback
- OTP delivery if WhatsApp Cloud API is not configured
- If Twilio also not configured → OTP logged to console (DEV MODE)

### Notification Priority Order
```
OTP:  WhatsApp Cloud API → Twilio SMS → console.log (dev)
Lead: Email (admin) + Email (user) + WhatsApp (admin) + WhatsApp (user)
      All run fire-and-forget after HTTP response is sent — no blocking
```

---

## 16. Real-Time (Socket.io)

```
Backend emits:
    io.to('admin-room').emit('lead:new', { lead })
    Triggered when:
    ├── OTP verified (lead converts to verified)
    └── Lead form submitted

Frontend (Admin panel) listens:
    └── Shows instant notification toast without page refresh

Connection:
    Admin browser connects via WebSocket on page load
    ├── Joins 'admin-room' on connect
    └── Disconnects logged on leave
```

---

## 17. Rate Limiting

| Route | Limit |
|---|---|
| `/api/*` (general) | 2,000 requests / 15 minutes |
| `/api/leads/send-otp` | 5 requests / 1 minute |
| `/api/admin/send-otp` | 5 requests / 1 minute |

---

## 18. API Reference

### Leads (`/api/leads`)

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/visitor-id` | None | Generate anonymous visitor UUID |
| POST | `/track` | None | Track page event + update score |
| POST | `/send-otp` | None | Send OTP via WhatsApp/SMS |
| POST | `/verify-otp` | None | Verify OTP → issue JWT + trigger notifications |
| POST | `/submit` | None | Submit full lead form |
| POST | `/cta` | None | Track CTA click (brochure, price, site visit) |

### Projects (`/api/projects`)

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/` | None | List projects (filters: city, corridor, status, budget) |
| GET | `/:slug` | None | Single project by slug |
| GET | `/slugs/all` | None | All project slugs (for generateStaticParams) |
| POST | `/` | Admin JWT | Create project |
| PUT | `/:id` | Admin JWT | Update project |
| DELETE | `/:id` | Admin JWT | Delete project |

### Blogs (`/api/blogs`)

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/` | None | List published blogs |
| GET | `/:slug` | None | Single blog by slug |
| POST | `/` | Admin JWT | Create blog |
| PUT | `/:id` | Admin JWT | Update blog |
| DELETE | `/:id` | Admin JWT | Delete blog |

### Authors (`/api/authors`)

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/` | None | List active authors |
| GET | `/:slug` | None | Single author |
| POST | `/` | Admin JWT | Create author |
| PUT | `/:id` | Admin JWT | Update author |
| DELETE | `/:id` | Admin JWT | Delete author |

### Admin (`/api/admin`) — JWT required

| Method | Endpoint | Description |
|---|---|---|
| POST | `/send-otp` | Admin OTP login |
| POST | `/login` | Verify OTP → JWT |
| GET | `/dashboard` | Stats summary |
| GET | `/leads` | All leads (filter, sort, paginate) |
| PUT | `/leads/:id` | Update lead status/remarks |
| POST | `/csv-import` | Bulk import projects via CSV |

### Settings (`/api/settings`)

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/` | None | Fetch site settings |
| PUT | `/` | Admin JWT | Update site settings |

### Indexing (`/api/indexing`)

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/submit` | Admin JWT | Submit URLs to Google + IndexNow |
| GET | `/logs` | Admin JWT | View submission history |
| POST | `/test-google` | Admin JWT | Test Google API connection |

### Upload (`/api/upload`)

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/` | Admin JWT | Upload image → returns URL |

### AI (`/api/ai`)

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/seo-suggestions` | Admin JWT | Anthropic Claude SEO analysis |

---

## 19. Deployment Workflow

### Architecture

```
Internet
    │
    ▼
nginx (port 80/443)
    ├── /api/*  →  proxy_pass http://localhost:5007  (Express backend)
    ├── /uploads/* → proxy_pass http://localhost:5007 (static images)
    └── /*      →  proxy_pass http://localhost:3000  (Next.js frontend)
```

### PM2 Processes

```bash
# Backend
pm2 start backend/server.js --name realestate-backend

# Frontend
pm2 start npm --name realestate-frontend -- start

# Save process list
pm2 save
pm2 startup
```

### Deploy Steps

```bash
# Pull latest code
git pull origin main

# Backend
cd backend && npm install
pm2 restart realestate-backend

# Frontend
cd frontend && npm install && npm run build
pm2 restart realestate-frontend
```

### GitHub Actions (CI/CD)
Workflow file in `.github/workflows/` — triggers on push to `main`:
1. SSH into VPS
2. `git pull`
3. `npm install` (backend + frontend)
4. `npm run build` (frontend)
5. `pm2 restart` both processes

---

## 20. E-E-A-T Trust System

Google's E-E-A-T (Experience, Expertise, Authoritativeness, Trustworthiness) signals implemented:

### Author Model (Expertise + Experience)
Each blog post and page is linked to an Author with:
- Name, photo, designation
- Years of experience ("8+ years")
- RERA Agent ID
- Credentials (CREDAI Member, certifications)
- Education
- Deals closed count ("200+ deals")
- Languages spoken
- Specialization areas (Dwarka Expressway, Golf Course Road, etc.)

### Trust Pages (Authoritativeness + Trustworthiness)
| Page | Purpose |
|---|---|
| `/about` | Team listing with Author cards + company story |
| `/contact` | Office address, phone, map, working hours |
| `/privacy-policy` | GDPR-style data handling policy |
| `/terms` | Terms of service |
| `/disclaimer` | Real estate disclaimer |

### Schema Signals
- `Organization` schema on homepage
- `LocalBusiness` schema with address, phone, coordinates, hours
- `Person` schema per author
- `AggregateRating` from site settings (rating + reviewCount)
- RERA number displayed on every project page

---

## Brand Colors

| Name | Hex | Usage |
|---|---|---|
| Brand Dark | `#075B63` | Primary CTA, headers, footer |
| Brand Accent | `#08C9A4` | Highlights, badges, active states |
| Brand Mint | `#EAF8F5` | Section backgrounds |
| Brand Text | `#122326` | Body text |
| Brand Muted | `#5F7478` | Secondary / placeholder text |

---

*Last updated: June 2026*
