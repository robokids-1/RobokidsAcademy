# Deployment Guide for BotBees Academy

This guide covers multiple ways to deploy your static website to the internet.

## 🚀 Quick Deploy Options

### Option 1: GitHub Pages (Free & Easy)

**Method A: Using GitHub Actions (Recommended)**

The repository includes a GitHub Actions workflow that automatically deploys from the `/src` folder.

**Steps:**
1. Push your code to GitHub (if not already done)
2. Go to your repository: https://github.com/robokids-1/RoboKidsAcademy
3. Click **Settings** → **Pages**
4. Under **Source**, select:
   - **Deploy from a branch** → Change to **GitHub Actions**
5. The workflow will automatically deploy when you push to `main`
6. Your site will be live at: `https://robokids-1.github.io/RoboKidsAcademy/`

**Note:** The first deployment may take 2-3 minutes. You can check the progress in the **Actions** tab.

**Method B: Using /docs folder (Alternative)**

If you prefer the traditional method:
1. Move all files from `src/` to a `docs/` folder
2. Go to **Settings** → **Pages**
3. Select **Deploy from a branch** → Branch: `main`, Folder: `/docs`
4. Click **Save**

---

### Option 2: Netlify (Free & Fast)

**Method A: Drag & Drop**
1. Go to [netlify.com](https://www.netlify.com) and sign up/login
2. Drag and drop your `src` folder onto Netlify
3. Your site is live instantly!

**Method B: Git Integration**
1. Go to [netlify.com](https://www.netlify.com) and sign up/login
2. Click **Add new site** → **Import an existing project**
3. Connect your GitHub account
4. Select the `RoboKidsAcademy` repository
5. Build settings:
   - Base directory: `src`
   - Publish directory: `src`
   - Build command: (leave empty)
6. Click **Deploy site**

Your site will be live at: `https://your-site-name.netlify.app`

---

### Option 3: Vercel (Free & Modern)

1. Go to [vercel.com](https://vercel.com) and sign up/login
2. Click **Add New Project**
3. Import your GitHub repository `RoboKidsAcademy`
4. Configure:
   - Root Directory: `src`
   - Framework Preset: Other
5. Click **Deploy**

Your site will be live at: `https://your-site-name.vercel.app`

---

### Option 4: Cloudflare Pages (Free)

1. Go to [pages.cloudflare.com](https://pages.cloudflare.com) and sign up/login
2. Click **Create a project** → **Connect to Git**
3. Select GitHub and authorize
4. Choose `RoboKidsAcademy` repository
5. Build settings:
   - Framework preset: None
   - Build command: (leave empty)
   - Build output directory: `src`
6. Click **Save and Deploy**

---

## 📝 Pre-Deployment Checklist

- [ ] Test the website locally
- [ ] Check all links work correctly
- [ ] Verify images and assets load properly
- [ ] Test on mobile devices
- [ ] Ensure forms work (if applicable)

## 🔧 Custom Domain (Optional)

All platforms above support custom domains:

1. **GitHub Pages**: Settings → Pages → Custom domain
2. **Netlify**: Site settings → Domain management
3. **Vercel**: Project settings → Domains
4. **Cloudflare Pages**: Custom domains → Add domain

## 🛠️ Troubleshooting

### GitHub Pages not showing
- Wait 5-10 minutes after enabling
- Check that the branch and folder are correct
- Verify files are in the `src` folder

### Assets not loading
- Check file paths are relative (not absolute)
- Ensure CSS/JS files are in the same folder or paths are correct

### 404 errors
- Make sure `index.html` is in the root of the published folder
- Check case sensitivity (Linux servers are case-sensitive)

## 📊 Recommended: GitHub Pages

For this project, **GitHub Pages** is recommended because:
- ✅ Free forever
- ✅ Easy to set up
- ✅ Automatic updates when you push to GitHub
- ✅ Custom domain support
- ✅ HTTPS by default

## 🎯 Next Steps After Deployment

1. Share your live URL
2. Set up Google Analytics (optional)
3. Add a custom domain (optional)
4. Set up automatic deployments

---

**Need help?** Check the platform-specific documentation or open an issue on GitHub.
