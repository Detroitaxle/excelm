# Excelm Deployment Plan (100% Free)

## 📋 Repository Review Summary

### Current Stack
- **Framework**: Next.js 14.2.15 (App Router)
- **Database**: Supabase (PostgreSQL)
- **External APIs**: FedEx Tracking API
- **Deployment Configs**: Vercel & Netlify ready

### Required Environment Variables

1. **VITE_SUPABASE_URL** - Supabase project URL
2. **SUPABASE_SERVICE_ROLE_KEY** - Supabase service role key (server-side only)
3. **FEDEX_API_KEY** - FedEx API authentication token

### Issues Found

⚠️ **Environment Variable Naming Issue**
- Currently using `VITE_SUPABASE_URL` (Vite convention)
- Next.js should use `NEXT_PUBLIC_` prefix for client-side variables
- Server-side variables don't need prefix

## 🆓 Free Deployment Options

### Option 1: Vercel (Recommended) ⭐

**Why Vercel:**
- ✅ Free tier: Unlimited personal projects
- ✅ Perfect Next.js integration
- ✅ Automatic deployments from Git
- ✅ Built-in environment variable management
- ✅ Free SSL certificates
- ✅ Global CDN
- ✅ 100GB bandwidth/month free

**Free Tier Limits:**
- 100GB bandwidth/month
- Serverless function execution time: 10 seconds (Hobby)
- Unlimited requests

**Steps:**
1. Push code to GitHub/GitLab/Bitbucket
2. Connect repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy automatically

**Cost:** $0/month

---

### Option 2: Netlify

**Why Netlify:**
- ✅ Free tier available
- ✅ Good Next.js support
- ✅ Automatic deployments
- ✅ 100GB bandwidth/month free

**Free Tier Limits:**
- 100GB bandwidth/month
- 300 build minutes/month
- Serverless function: 125K requests/month

**Steps:**
1. Push code to Git repository
2. Connect to Netlify
3. Add environment variables
4. Deploy

**Cost:** $0/month

---

### Option 3: Railway (Alternative)

**Why Railway:**
- ✅ $5 free credit monthly (usually enough for small apps)
- ✅ Easy PostgreSQL setup
- ✅ Simple deployment

**Free Tier:**
- $5 credit/month
- Pay-as-you-go after credit

**Cost:** ~$0-5/month (usually free for small apps)

---

## 🗄️ Database: Supabase (Free Tier)

**Free Tier Includes:**
- ✅ 500MB database storage
- ✅ 2GB bandwidth/month
- ✅ Unlimited API requests
- ✅ PostgreSQL database
- ✅ Built-in authentication (if needed later)
- ✅ Real-time subscriptions

**Limits:**
- 500MB database
- 2GB bandwidth/month
- 50,000 monthly active users

**Setup:**
1. Sign up at https://supabase.com
2. Create new project
3. Get project URL and service role key
4. Run migrations: `supabase db push` or via Supabase dashboard

**Cost:** $0/month (free tier)

---

## 📦 FedEx API

**Options:**

1. **FedEx Developer Portal** (Free Sandbox)
   - Free sandbox/testing environment
   - Limited to test data
   - Good for development

2. **FedEx Production API**
   - Requires FedEx account
   - May have usage fees (check FedEx pricing)
   - For production use

**Setup:**
1. Register at https://developer.fedex.com
2. Create app and get API credentials
3. Use sandbox for testing (free)
4. Upgrade to production when ready

**Cost:** Free for sandbox, varies for production

---

## 🔧 Required Fixes Before Deployment

### 1. Fix Environment Variable Names

**Current Issue:** Using `VITE_` prefix (Vite convention) in Next.js

**Files to Update:**
- `next.config.js`
- All API route files

**Recommended Fix:**
- Server-side: `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `FEDEX_API_KEY`
- Client-side: `NEXT_PUBLIC_SUPABASE_URL` (if needed)

### 2. Create `.env.example` File

Document all required environment variables.

### 3. Update README

Add comprehensive deployment instructions.

---

## 📝 Step-by-Step Deployment Guide (Vercel)

### Prerequisites
1. GitHub/GitLab/Bitbucket account
2. Supabase account (free)
3. FedEx Developer account (for API key)

### Step 1: Set Up Supabase

1. Go to https://supabase.com and sign up
2. Create a new project
3. Wait for project to initialize
4. Go to **Settings** → **API**
5. Copy:
   - **Project URL** (will be `VITE_SUPABASE_URL`)
   - **service_role key** (will be `SUPABASE_SERVICE_ROLE_KEY`)
6. Go to **SQL Editor** and run migrations:
   ```sql
   -- Run both migration files
   -- 20251122_create_orders_from_tsv.sql
   -- 20251123_add_agent_action.sql
   ```

### Step 2: Set Up FedEx API

1. Go to https://developer.fedex.com
2. Sign up for developer account
3. Create a new app
4. Get API credentials (sandbox or production)
5. Copy the API key

### Step 3: Prepare Code

1. Fix environment variable names (see fixes above)
2. Push code to Git repository
3. Ensure all migrations are in `supabase/migrations/`

### Step 4: Deploy to Vercel

1. Go to https://vercel.com and sign up
2. Click **Add New Project**
3. Import your Git repository
4. Configure project:
   - **Framework Preset**: Next.js
   - **Root Directory**: `./` (default)
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`
5. Add Environment Variables:
   ```
   VITE_SUPABASE_URL=your_supabase_url
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   FEDEX_API_KEY=your_fedex_api_key
   ```
6. Click **Deploy**
7. Wait for deployment to complete

### Step 5: Verify Deployment

1. Visit your Vercel URL
2. Test TSV upload
3. Test FedEx check (if API key is configured)
4. Verify database connections

---

## 🔒 Security Recommendations

1. **Never commit `.env` files** (already in `.gitignore`)
2. **Use Supabase Row Level Security (RLS)** for production
3. **Rotate API keys** regularly
4. **Use environment variables** for all secrets
5. **Enable Supabase RLS policies** to restrict database access

---

## 📊 Cost Breakdown (Monthly)

| Service | Free Tier | Your Usage | Cost |
|---------|-----------|------------|------|
| Vercel | Unlimited projects | Small app | **$0** |
| Supabase | 500MB DB, 2GB bandwidth | Small-medium | **$0** |
| FedEx API | Sandbox free | Testing | **$0** |
| **Total** | | | **$0/month** |

---

## 🚀 Quick Start Commands

```bash
# 1. Install dependencies
npm install

# 2. Set up environment variables (create .env.local)
VITE_SUPABASE_URL=your_url
SUPABASE_SERVICE_ROLE_KEY=your_key
FEDEX_API_KEY=your_key

# 3. Run migrations (if using Supabase CLI)
supabase db push

# 4. Run locally
npm run dev

# 5. Build for production
npm run build
```

---

## ⚠️ Important Notes

1. **Free tier limits** may require upgrade for high traffic
2. **FedEx API** sandbox is free but limited to test data
3. **Supabase free tier** has 500MB database limit
4. **Vercel free tier** has 100GB bandwidth/month
5. All services offer paid tiers if you exceed limits

---

## 🐛 Troubleshooting

### Database Connection Issues
- Verify Supabase URL and service role key
- Check Supabase project is active
- Verify migrations ran successfully

### FedEx API Issues
- Verify API key is correct
- Check if using sandbox vs production endpoint
- Verify API key has tracking permissions

### Deployment Issues
- Check build logs in Vercel/Netlify
- Verify all environment variables are set
- Check Next.js version compatibility

---

## 📚 Additional Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [FedEx Developer Portal](https://developer.fedex.com)
- [Next.js Deployment](https://nextjs.org/docs/deployment)

---

**Last Updated:** 2024
**Status:** Ready for deployment (after environment variable fixes)

