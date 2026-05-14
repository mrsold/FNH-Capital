# Hosting on HostArmada (Shared Hosting)

Since your project is a **React Single Page Application (SPA)** with a **Firebase backend**, follow these steps to deploy it to HostArmada.

## 1. Build your project
First, you need to create a production-ready build of your application.
Open your terminal in the project root and run:
```bash
npm run build
```
This will create a `dist` folder containing all your static files (HTML, JS, CSS).

## 2. Upload to HostArmada
Connect to your HostArmada hosting via **cPanel File Manager** or **FTP** (using a client like FileZilla).

1.  Navigate to your domain's root folder (usually `public_html`).
2.  Upload the **contents** of the `dist` folder into `public_html`.
    *   *Note: Do not upload the `dist` folder itself, just everything inside it (index.html, assets/, etc.).*

## 3. Configure Client-Side Routing (.htaccess)
Because React handles routing in the browser, you need to tell HostArmada's server (Apache) to redirect all requests to `index.html`. Without this, refreshing the page on a route like `/admin` might result in a 404 error.

1.  In your `public_html` folder, create a new file named `.htaccess`.
2.  Paste the following code into it:

```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteCond %{REQUEST_FILENAME} !-l
  RewriteRule . /index.html [L]
</IfModule>
```

## 4. Firebase Configuration
Your app uses Firebase, which works entirely in the browser. You don't need to install anything special on HostArmada for Firebase to work. Your API keys are already bundled in the `dist` folder.

**Security Reminder:** Ensure you have restricted your API keys in the [Google Cloud Console](https://console.cloud.google.com/) to only allow requests from your HostArmada domain.

## Summary Checklist
- [ ] Ran `npm run build`
- [ ] Uploaded `dist/` contents to `public_html/`
- [ ] Created `.htaccess` for routing
- [ ] Verified Firebase rules are deployed (`npm run deploy` if you have Firebase CLI or just ensure you clicked deploy in AI Studio)
