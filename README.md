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

## Deploy (Netlify + Render)

### 1. Backend on Render

1. Go to [render.com](https://render.com) → **New** → **Blueprint** (or **Web Service**)
2. Connect repo: `CongoMusahAdama/futurelink`
3. Use `render.yaml` (Root Directory: repo root) **or** manual setup:
   - **Root Directory:** `backend`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
4. **Environment variables:**

   | Key | Value |
   |-----|--------|
   | `MONGODB_URI` | Your MongoDB Atlas connection string |
   | `CLIENT_ORIGIN` | Your Netlify URL, e.g. `https://futurelink.netlify.app` |

5. Copy the Render URL, e.g. `https://futurelink-api.onrender.com`
6. In **MongoDB Atlas** → Network Access → allow `0.0.0.0/0` (or Render IPs)

Health check: `https://YOUR-RENDER-URL.onrender.com/api/health`

### 2. Frontend on Netlify

1. Go to [netlify.com](https://netlify.com) → **Add new site** → **Import from Git**
2. Select `CongoMusahAdama/futurelink`
3. Netlify reads `netlify.toml` automatically:
   - Build: `npm run build`
   - Publish: `dist`
4. **Environment variable:**

   | Key | Value |
   |-----|--------|
   | `VITE_API_URL` | `https://YOUR-RENDER-URL.onrender.com/api` |

5. Deploy. Open your Netlify URL → `#checkin` for venue tablet.

### 3. Link them together

After Netlify gives you a URL, add it to Render as `CLIENT_ORIGIN` and redeploy Render if you set it after the first deploy.

**Ops routes:** `yoursite.netlify.app/#checkin` · `#dashboard` · `#dashboard-tv` · `#admin` · `#signage`

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
