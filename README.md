# Excelm – TSV Returns Tracker

Upload TSV, check FedEx, manage in Excel-like sheet with filtering, row deletion, and agent actions.

## 🚀 Quick Start (Free Deployment)

### Prerequisites
- Node.js 18+ installed
- Git account (GitHub/GitLab/Bitbucket)
- Supabase account (free): https://supabase.com
- FedEx Developer account (free sandbox): https://developer.fedex.com

### Local Development Setup

1. **Clone and install:**
   ```bash
   git clone <your-repo-url>
   cd excelm
   npm install
   ```

2. **Set up environment variables:**
   Create `.env.local` file:
   ```env
   VITE_SUPABASE_URL=https://your-project.supabase.co
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
   FEDEX_API_KEY=your-fedex-api-key
   ```

3. **Set up database:**
   - Go to Supabase dashboard → SQL Editor
   - Run migrations from `supabase/migrations/`:
     - `20251122_create_orders_from_tsv.sql`
     - `20251123_add_agent_action.sql`

4. **Run locally:**
   ```bash
   npm run dev
   ```

### Free Deployment (Vercel)

1. **Push to Git:**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Deploy to Vercel:**
   - Go to https://vercel.com
   - Click "Add New Project"
   - Import your Git repository
   - Add environment variables in Vercel dashboard
   - Click "Deploy"

3. **Environment Variables in Vercel:**
   - `VITE_SUPABASE_URL` - Your Supabase project URL
   - `SUPABASE_SERVICE_ROLE_KEY` - Supabase service role key
   - `FEDEX_API_KEY` - FedEx API key

**Cost:** $0/month (100% free tier)

See `DEPLOYMENT_PLAN.md` for detailed deployment guide.

## ✨ Features

- **TSV Upload** - Upload tab-separated files with order data
- **Excel-like Grid** - Filter, sort, and manage data in a spreadsheet-like interface
- **Row Selection** - Select multiple rows for bulk operations
- **Row Deletion** - Delete unwanted rows individually or in bulk
- **FedEx Tracking** - Check delivery status via FedEx API (on selected rows)
- **Agent Actions** - Manual status tracking with color coding:
  - 🟢 Refunded (Green)
  - 🔴 Closed (Red)
  - 🟡 No wh (Amber)
  - 🔵 Replacement Requested (Blue)
  - 🟠 Hold (Orange)
- **Row Color Coding** - Entire row changes color based on agent action
- **Export to CSV** - Download filtered/selected data
- **Dark/Light Theme** - Toggle between themes
- **Filtering** - Excel-like column filters

## 📋 TSV File Format

Your TSV file should have these headers:
- **Tracking ID** (required)
- Order ID
- Order date
- Return request date
- Label cost
- Return carrier
- Merchant SKU
- Order Amount

## 🔧 Environment Variables

| Variable | Description | Where to Get |
|----------|-------------|--------------|
| `VITE_SUPABASE_URL` | Supabase project URL | Supabase Dashboard → Settings → API |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key | Supabase Dashboard → Settings → API |
| `FEDEX_API_KEY` | FedEx API authentication token | FedEx Developer Portal |

## 📊 Free Tier Limits

- **Vercel**: 100GB bandwidth/month, unlimited projects
- **Supabase**: 500MB database, 2GB bandwidth/month
- **FedEx API**: Free sandbox for testing

## 🛠️ Tech Stack

- Next.js 14 (App Router)
- React 18
- Supabase (PostgreSQL)
- Tailwind CSS
- React Data Grid
- TanStack Query

## 📝 License

See LICENSE file for details.
