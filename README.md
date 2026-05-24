# GurgaonRealty — Real Estate Lead Generation Website

A full-stack, SEO-optimised real estate lead generation website for the Gurgaon property market.

**Stack:** Next.js 14 · Node.js/Express · MongoDB · Nodemailer · Twilio (OTP + WhatsApp)

---

## Project Structure

```
gurgaon-realestate/
├── backend/          Node.js + Express API
└── frontend/         Next.js 14 frontend
```

---

## Quick Start

### 1. Backend Setup

```bash
cd backend
npm install

# Copy and fill in environment variables
cp .env.example .env
# Edit .env with your MongoDB URI, SMTP, Twilio credentials

# Seed sample data (5 projects + admin/manager/salesman users)
npm run seed

# Start backend
npm run dev        # development (nodemon)
npm start          # production
```

Backend runs at: `http://localhost:5000`

**Default Admin credentials after seeding:**
- Admin: `admin@gurgaonrealty.in` / `Admin@123`
- Manager: `manager@gurgaonrealty.in` / `Manager@123`
- Salesman: `sales@gurgaonrealty.in` / `Sales@123`

---

### 2. Frontend Setup

```bash
cd frontend
npm install

# Copy and fill in environment variables
cp .env.example .env.local
# NEXT_PUBLIC_API_URL=http://localhost:5000/api

# Development
npm run dev

# Production build
npm run build
npm start
```

Frontend runs at: `http://localhost:3000`

---

## Environment Variables

### Backend (`backend/.env`)

| Variable | Description |
|---|---|
| `MONGODB_URI` | MongoDB connection string |
| `JWT_SECRET` | Secret for JWT tokens |
| `PORT` | Server port (default: 5000) |
| `EMAIL_HOST` | SMTP host |
| `EMAIL_PORT` | SMTP port |
| `EMAIL_USER` | SMTP email address |
| `EMAIL_PASS` | SMTP password |
| `EMAIL_FROM` | From email address |
| `TWILIO_ACCOUNT_SID` | Twilio Account SID |
| `TWILIO_AUTH_TOKEN` | Twilio Auth Token |
| `TWILIO_PHONE_NUMBER` | Twilio phone for OTP SMS |
| `TWILIO_WHATSAPP_NUMBER` | Twilio WhatsApp-enabled number |
| `SITE_URL` | Live site URL |
| `ADMIN_EMAIL` | Admin notification email |

### Frontend (`frontend/.env.local`)

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_API_URL` | Backend API URL |
| `NEXT_PUBLIC_GA4_ID` | Google Analytics 4 Measurement ID |
| `NEXT_PUBLIC_SITE_URL` | Live site URL for OG tags |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | WhatsApp number (country code + number) |
| `NEXT_PUBLIC_PHONE` | Display phone number |

---

## Features

### Lead Capture & Tracking
- **Anonymous visitor tracking** — assigns UUID before any form fill
- **Progressive lead capture** — OTP only on high-intent actions (price request, brochure download, site visit)
- **Behaviour-based lead scoring** — automated scoring from page events (page_visit → project_revisit → price_view → CTA clicks)
- **UTM parameter capture** — source/medium/campaign stored per lead

### Lead Scoring
| Score | Label | Trigger Events |
|---|---|---|
| 0–10 | Cold | Page visits only |
| 11–30 | Warm | Project views, floor plan |
| 31–60 | Hot | Price section, brochure, WhatsApp click |
| 60+ | Priority | Call click, site visit request |

### WhatsApp Automation
Automated WhatsApp messages trigger on key events (post OTP consent):
- Brochure requested → send brochure template
- Price list requested → send pricing template
- Site visit booked → send confirmation + directions
- Follow-up → send after 24h of inactivity

> **Dev mode:** When Twilio credentials are not set, OTPs are logged to console instead of being sent via SMS.

### CRM Admin Panel
- URL: `/admin`
- JWT-authenticated login
- Lead table with score, status, source, budget filters
- Lead detail drawer with Call / WhatsApp CTA
- Dashboard stats: total, new, hot, warm, cold, site visit counts

### SEO Pages
- Homepage with LocalBusiness schema
- New Launch Projects in Gurgaon
- New Projects in Gurgaon
- Residential Property in Gurgaon
- Dwarka Expressway Projects
- Sector 113, 106, 102, 37D pages
- New Gurgaon, Golf Course Extension Road, SPR Road
- Project detail pages (`/project/[slug]`)
- Blog with articles (`/blog/[slug]`)
- Auto-generated sitemap at `/sitemap.xml`
- robots.txt blocking `/admin`

---

## API Endpoints

### Leads (`/api/leads`)
| Method | Endpoint | Description |
|---|---|---|
| GET | `/visitor-id` | Get/create visitor ID |
| POST | `/track` | Track page event |
| POST | `/send-otp` | Send OTP via Twilio SMS |
| POST | `/verify-otp` | Verify OTP code |
| POST | `/submit` | Submit full lead form |
| POST | `/cta` | Track CTA click (triggers WhatsApp) |

### Projects (`/api/projects`)
| Method | Endpoint | Description |
|---|---|---|
| GET | `/` | List projects (with filters) |
| GET | `/featured` | Featured projects |
| GET | `/:slug` | Single project by slug |

### Admin (`/api/admin`) — JWT required
| Method | Endpoint | Description |
|---|---|---|
| POST | `/login` | Admin login |
| GET | `/dashboard` | Stats summary |
| GET | `/leads` | All leads with filters |
| GET | `/leads/:id` | Single lead |
| PUT | `/leads/:id` | Update lead |
| POST | `/whatsapp/send` | Manual WhatsApp message |
| GET | `/projects` | All projects |
| POST | `/projects` | Create project |
| PUT | `/projects/:id` | Update project |
| DELETE | `/projects/:id` | Delete project |
| GET | `/reports/source` | Leads by source |
| GET | `/reports/project` | Leads by project |

---

## Deployment

### Backend (Node.js)
- Deploy to Railway, Render, or DigitalOcean
- Set all env vars in deployment dashboard
- MongoDB: use MongoDB Atlas free tier

### Frontend (Next.js)
- Deploy to Vercel (recommended for Next.js)
- Set `NEXT_PUBLIC_API_URL` to your backend URL
- Custom domain: point `www.gurgaonrealty.in` to Vercel

---

## Tech Stack Details

- **Next.js 14** — App Router, Server Components, generateMetadata for SEO
- **Tailwind CSS** — Custom brand color palette, reusable component classes
- **MongoDB + Mongoose** — Lead, Project, User, OTP models
- **Nodemailer** — OTP, welcome, notification, brochure email templates
- **Twilio** — SMS OTP + WhatsApp Business API messaging
- **JWT** — Admin authentication with role-based access

---

## Brand Colors

| Name | Hex | Usage |
|---|---|---|
| Brand Dark | `#075B63` | Primary CTA, headers, footer |
| Brand Accent | `#08C9A4` | Highlights, badges, icons |
| Brand Mint | `#EAF8F5` | Section backgrounds |
| Brand Text | `#122326` | Body text |
| Brand Muted | `#5F7478` | Secondary text |
# newprojectingurgaon
