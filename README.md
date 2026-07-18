# futurelink

Landing page for **EasyEvents Gh** — a Smart Event Intelligence platform by Future-Link Services.

> Smooth Entry, Smart Insights.

## Quick Start

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## Stack

- React 19 + Vite
- Tailwind CSS 4
- Lucide React icons

## Sections

- **Hero** — Brand positioning and live dashboard preview
- **Services** — Registration offerings from brand brochure
- **How It Works** — Three-station registration flow (Fast Lane, Help Desk, VIP)
- **Dashboard** — Real-time analytics and end-of-day reporting preview
- **Pricing** — Basic, Standard, and Premium packages
- **Benefits** — Value propositions for event organizers
- **Contact** — Demo request form

## Deploy (Vercel + Render)

### 1. Backend on Render

1. Go to [render.com](https://render.com) → **New** → **Blueprint** (or **Web Service**)
2. Connect repo: `CongoMusahAdama/futurelink`
3. Use `render.yaml` (Root Directory: repo root) **or** manual setup:
   - **Recommended — Root Directory:** `backend`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **If Root Directory is empty (repo root):** Build Command `npm install` (installs backend via `postinstall`), Start Command `npm start`
4. **Environment variables:**

   | Key | Value |
   |-----|--------|
   | `MONGODB_URI` | Your MongoDB Atlas connection string |
   | `CLIENT_ORIGIN` | `https://future-linkservices.com,https://www.future-linkservices.com,http://localhost:5173` |

5. **Live API:** [https://futurelink-ufwi.onrender.com](https://futurelink-ufwi.onrender.com)
6. In **MongoDB Atlas** → Network Access → allow `0.0.0.0/0` (or Render IPs)

Health check: [https://futurelink-ufwi.onrender.com/api/health](https://futurelink-ufwi.onrender.com/api/health)

### 2. Frontend on Vercel

1. Go to [vercel.com](https://vercel.com) → sign in with GitHub → **Add New Project**
2. Import `CongoMusahAdama/futurelink`
3. Vercel reads `vercel.json` automatically (Vite build → `dist`)
4. **Environment variable** (Project → Settings → Environment Variables):

   | Key | Value |
   |-----|--------|
   | `VITE_API_URL` | `https://futurelink-ufwi.onrender.com/api` |

5. Deploy. Your site will be at `https://your-project.vercel.app`

6. **Custom domain** (Settings → Domains):
   - Add `future-linkservices.com` and `www.future-linkservices.com`
   - Copy the DNS records Vercel shows into **Hostinger DNS**

### 3. Hostinger DNS (for custom domain)

Remove old Netlify records, then add what Vercel provides. Typical setup:

| Type | Name | Value |
|------|------|--------|
| **A** | `@` | IP from Vercel domain settings |
| **CNAME** | `www` | `cname.vercel-dns.com` (or value Vercel shows) |

### 4. Link them together

- `*.vercel.app` preview URLs are allowed by the API automatically
- Custom domain `future-linkservices.com` is in `CLIENT_ORIGIN` — redeploy Render after updating env if needed

**Ops routes:** `yoursite.com/#checkin` · `#dashboard` · `#admin` · `#signage`

## Brand Colors

| Token | Hex | Usage |
|-------|-----|-------|
| Navy | `#0a2540` | Headings, footer, dark sections |
| Brand Blue | `#2563eb` | Buttons, accents, logo |
| Gold | `#c9a227` | Highlights, dividers, badges |

## Next Steps

Future development will add:
- QR code registration system
- Live attendance dashboard (real data)
- Admin panel for event organizers
- End-of-day analytics report generation
