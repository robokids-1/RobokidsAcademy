# RoboKids Academy

A fun, interactive website for a robotics academy designed for kids!

## 🚀 Quick Start

### View Locally
```bash
cd src
python -m http.server 8000
# Then open http://localhost:8000 in your browser
```

## 📦 Deployment

This is a static website that can be deployed to multiple platforms. See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed instructions.

### Quick Deploy Options:

1. **GitHub Pages** (Recommended)
   - **Option A (GitHub Actions)**: Go to Settings → Pages → Source: **GitHub Actions**
   - **Option B (docs folder)**: Run `./setup-docs.sh`, then Settings → Pages → Branch: `main`, Folder: `/docs`
   - Site will be at: `https://robokids-1.github.io/RoboKidsAcademy/`

2. **Netlify**
   - Drag & drop the `src` folder to [netlify.com](https://netlify.com)

3. **Vercel**
   - Connect GitHub repo to [vercel.com](https://vercel.com)

## 📁 Project Structure

```
RoboKidsAcademy/
├── src/
│   ├── index.html          # Main homepage
│   ├── enroll.html         # Enrollment form
│   ├── styles.css          # Main stylesheet
│   ├── enroll-styles.css   # Enrollment form styles
│   └── script.js           # JavaScript functionality
├── .github/
│   └── workflows/
│       └── deploy.yml      # GitHub Pages deployment
├── netlify.toml            # Netlify configuration
├── vercel.json             # Vercel configuration
└── README.md               # This file
```

## ✨ Features

- 🤖 Kid-friendly design with animations
- 📱 Fully responsive (mobile, tablet, desktop)
- 🎮 Interactive elements
- 📝 Enrollment form
- 🎨 Modern CSS with smooth animations

## 🔗 Links

- [Deployment Guide](./DEPLOYMENT.md)
- [GitHub Repository](https://github.com/robokids-1/RoboKidsAcademy)

---

**Built with ❤️ for RoboKids Academy**

