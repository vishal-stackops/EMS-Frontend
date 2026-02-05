# Deploying EMS Frontend to Vercel

## Quick Start Guide

### Prerequisites
✅ Backend deployed to Render  
✅ Backend URL available (e.g., `https://ems-backend-xxxx.onrender.com`)

---

### Step 1: Push Frontend to GitHub

Ensure your latest changes are pushed:

```bash
cd c:\Users\Admin\Desktop\React\employee-management-system
git add .
git commit -m "Configure for Vercel deployment"
git push origin main
```

---

### Step 2: Create Vercel Account & Import Project

1. **Go to [vercel.com](https://vercel.com)** and sign up/login with GitHub
2. **Click "Add New..."** → **"Project"**
3. **Import repository**: `vishal-stackops/EMS-Frontend`
4. **Configure project:**
   - Framework Preset: **Vite** (auto-detected)
   - Root Directory: `./`
   - Build Command: `npm run build` (auto-detected)
   - Output Directory: `dist` (auto-detected)
   - Install Command: `npm install` (auto-detected)

---

### Step 3: Set Environment Variables

Before deploying, add environment variable:

1. Expand **"Environment Variables"** section
2. Add variable:
   - **Name**: `VITE_API_URL`
   - **Value**: `https://your-backend-url.onrender.com/api`
   - Replace `your-backend-url` with your actual Render backend URL
3. Select **All** environments (Production, Preview, Development)

---

### Step 4: Deploy

1. **Click "Deploy"**
2. Wait for build to complete (2-3 minutes)
3. You'll get a URL like: `https://your-app.vercel.app`

---

### Step 5: Update Backend CORS

Now that you have your Vercel URL, update the backend:

1. **Go to Render dashboard** → Your backend service
2. **Navigate to Environment** tab
3. **Add/Update environment variable:**
   - Key: `FRONTEND_URL`
   - Value: `https://your-app.vercel.app` (your Vercel URL)
4. Service will auto-redeploy

---

### Step 6: Verify Deployment

1. **Visit your Vercel URL**
2. **Test login** with your credentials
3. **Navigate through pages** (Dashboard, Employees, etc.)
4. **Refresh pages** to verify routing works
5. **Check browser console** for errors

---

## Configuration Files Created

- **[vercel.json](file:///c:/Users/Admin/Desktop/React/employee-management-system/vercel.json)** - Vercel configuration with SPA routing
- **[.env.example](file:///c:/Users/Admin/Desktop/React/employee-management-system/.env.example)** - Environment variable template
- **[.gitignore](file:///c:/Users/Admin/Desktop/React/employee-management-system/.gitignore)** - Updated with Vercel files

---

## Important Notes

### Environment Variables
- All Vite env vars must be prefixed with `VITE_`
- They are embedded at **build time**, not runtime
- Changing env vars requires **redeployment**

### Automatic Deployments
- Every push to `main` branch triggers automatic deployment
- Preview deployments created for pull requests
- Instant rollback available in Vercel dashboard

### Free Tier Features
✅ Unlimited deployments  
✅ Automatic HTTPS  
✅ Global CDN  
✅ Custom domains  
✅ Preview deployments

---

## Troubleshooting

### Build Fails
- Check build logs in Vercel dashboard
- Verify all dependencies are in `dependencies` section of `package.json`
- Ensure build command is correct

### 404 on Page Refresh
- Verify `vercel.json` exists with correct rewrite rules
- Check Vercel dashboard → Settings → General → Rewrites

### API Calls Fail / CORS Errors
1. Verify `VITE_API_URL` is set in Vercel environment variables
2. Check backend `FRONTEND_URL` matches your Vercel URL exactly
3. Open browser DevTools → Network tab to see actual API calls
4. Verify backend is running on Render

### Login Not Working
1. Check browser console for errors
2. Verify API URL is correct (should point to Render backend)
3. Test backend health endpoint directly: `https://your-backend-url.onrender.com/`
4. Check if backend is awake (Render free tier spins down after inactivity)

---

## Next Steps After Deployment

1. ✅ Test all features thoroughly
2. ✅ Set up custom domain (optional)
3. ✅ Configure preview deployments for testing
4. ✅ Monitor Vercel analytics
5. ✅ Set up UptimeRobot to keep backend alive

---

## Custom Domain Setup (Optional)

1. Go to Vercel project → **Settings** → **Domains**
2. Click **"Add"**
3. Enter your domain name
4. Follow DNS configuration instructions
5. Wait for DNS propagation (up to 48 hours)

---

## Useful Commands

```bash
# Local development
npm run dev

# Build for production (test locally)
npm run build

# Preview production build locally
npm run preview

# Install Vercel CLI (optional)
npm i -g vercel

# Deploy from CLI
vercel --prod
```

---

## Support

- **Vercel Docs**: [vercel.com/docs](https://vercel.com/docs)
- **Vite Docs**: [vitejs.dev](https://vitejs.dev)
- **Deployment Issues**: Check Vercel dashboard logs
