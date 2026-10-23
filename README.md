# Launching Soon Portfolio Landing Page

A modern, responsive, and aesthetic **"Launching Soon"** landing page built with **Material Design 3 (M3)** principles, smooth ambient background particle animations, glowing radial blobs, and a real-time countdown targeted to 2 months.

Ready to be hosted directly on **GitHub Pages** with zero configuration required.

---

## ✨ Features

- **Material Design 3 (M3) System**: Elevated dark glassmorphism surfaces (`backdrop-filter`), M3 elevation shadows, color token palettes, pill badges, and refined typography.
- **2 Months Countdown**:
  - Accurate breakdown into Days, Hours, Minutes, and Seconds.
  - Circular SVG progress rings that dynamically reflect remaining time.
  - Remembers countdown state using `localStorage`.
- **Interactive Ambient Canvas**:
  - Floating glowing particles and dynamic constellation lines.
  - Interactive mouse repulsion physics.
  - Smooth animated organic gradient blur blobs.
- **Subtle 3D Tilt**: Interactive perspective tilt on desktop viewport.
- **Early Access / Notify Form**:
  - Material input container with client-side email validation and interactive status feedback.
- **100% Static & GitHub Pages Ready**: Pure HTML5, CSS3, and modern Vanilla JavaScript with no npm build step or server requirements.

---

## 🚀 How to Host on GitHub Pages

1. Push this repository to GitHub:
   ```bash
   git init
   git add .
   git commit -m "feat: initial launching soon landing page"
   git branch -M main
   git remote add origin https://github.com/<your-username>/<your-repo-name>.git
   git push -u origin main
   ```
2. In your GitHub repository:
   - Go to **Settings** > **Pages** (under the "Code and automation" sidebar section).
   - Under **Build and deployment** > **Source**, choose **Deploy from a branch**.
   - Select **Branch**: `main` / `/(root)` and click **Save**.
3. Within 1-2 minutes, your website will be live at:
   `https://<your-username>.github.io/<your-repo-name>/`

---

## 🛠️ Customization

- **Social Links**: Update GitHub, LinkedIn, and Twitter profile URLs in [index.html](index.html#L110-L125).
- **Colors**: Customize color tokens inside `:root` in [style.css](style.css#L8-L27).
- **Target Date**: Adjust the duration inside `initCountdown()` in [script.js](script.js#L35) if you want to customize the launch timeline.
# landing_page_basic
