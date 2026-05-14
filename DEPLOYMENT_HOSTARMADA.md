# Hosting on HostArmada (Full-Stack Node.js Deployment)

Your project is a **Full-Stack application** (React frontend + Express backend). To host it on HostArmada using the **Node.js Selector**, follow these steps:

## 1. Project Organization
Ensure your project files are uploaded to a folder on your server (e.g., `/home/username/FNHCapital`).
The folder should contain:
- `dist/` (created after running `npm run build`)
- `package.json`
- `node_modules/` (or run NPM Install in cPanel)
- `.env` (or set Environment Variables in cPanel)

## 2. cPanel Node.js Selector Setup
In your cPanel, search for **"Setup Node.js App"** and configure it as follows:

1.  **Node.js version**: Select the latest stable version (e.g., 22.x).
2.  **Application mode**: Set to **Production**.
3.  **Application root**: `FNHCapital` (or the name of your project folder).
4.  **Application URL**: Select `fnhcapital.com`.
5.  **Application startup file**: `dist/server.cjs`
    *   *Note: Our build process bundles the server into `dist/server.cjs`. If you enter just `server.cjs` and the file is missing from the root, the site will be blank or show an error.*
6.  **Environment variables**: Add `RESEND_API_KEY` and any other secrets here.

## 3. Build & Install
Once the app is created in cPanel:
1.  Click **"Run NPM Install"** in the Node.js Selector interface.
2.  If you haven't uploaded the `dist` folder, you need to build it. It is recommended to build locally using `npm run build` and then upload the `dist` folder to your server's application root.

## 4. Why is my site blank? (Troubleshooting)
If you see a blank page or a 500 error, check these in order:

1.  **Check the logs (CRITICAL)**: 
    *   In the Node.js Selector, find **"Passenger log file"**.
    *   Set it to a real file path like `/home/mlscashc/logs/passenger.log` (create the `logs` folder first in File Manager if it doesn't exist).
    *   Restart the app and check that file for errors.
2.  **Startup File Mismatch**:
    *   If you ran `npm run build` locally and uploaded the `dist` folder: Use `dist/server.cjs`.
    *   If you see `server.cjs` in your root folder (not in `dist`), use `server.cjs`.
    *   *Recommendation*: Keep it in `dist/server.cjs` and ensure the `dist` folder was uploaded completely.
3.  **Run NPM Install**: Click the **"Run NPM Install"** button in cPanel. If your `node_modules` folder was uploaded, this might not be needed, but it helps if there are dependency errors.
4.  **Static File Conflict**: Delete any `index.html` file in your `root` or `public_html` folders. The app should only use `dist/index.html`.
5.  **Restart the App**: Every time you change a file or the cPanel settings, you MUST click the **RESTART** button in the Node.js Selector.
6.  **Verify Health**: Try visiting `https://fnhcapital.com/api/health`. If this returns a JSON object, the server is running correctly, and the issue is just serving the React frontend.

## 5. Contact Form API
Your contact form uses the backend API at `/api/contact`. By using the Node.js Selector, this route will be handled by the Express server defined in `server.ts`.
