# 🚀 Deployment Guide: DevToolKit

DevToolKit is built with **React**, **Vite**, and **Tailwind CSS**. Because it is a static Single Page Application (SPA), it can be hosted on any web server that can serve static files.

## 1. Prepare the Build
First, generate the production-ready files:
```bash
npm install
npm run build
```
This will create a `dist/` folder containing all the optimized assets (HTML, CSS, JS).

---

## 2. Recommended Hosting (Static)
These platforms are free for most use cases and provide the best performance via CDNs.

### Vercel / Netlify
1. Connect your GitHub repository.
2. Set **Build Command**: `npm run build`
3. Set **Output Directory**: `dist`
4. Deploy.

### GitHub Pages
1. Install the gh-pages package: `npm install gh-pages --save-dev`
2. Add `base: './'` to your `vite.config.ts` (if not already there).
3. Add a deploy script to `package.json`: `"deploy": "gh-pages -d dist"`
4. Run `npm run build && npm run deploy`.

---

## 3. Self-Hosting (VPS with Nginx)
If you are using your own Linux server, follow these steps:

1. Upload the contents of the `dist/` folder to `/var/www/devtoolkit`.
2. Configure Nginx to handle SPA routing (redirecting all paths to `index.html`):

```nginx
server {
    listen 80;
    server_name yourdomain.com;
    root /var/www/devtoolkit;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # Enable Gzip compression for better performance
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml;
}
```

---

## 4. Docker Deployment
If you prefer containerization, you can create a `Dockerfile`:

```dockerfile
# Build stage
FROM node:18-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Production stage
FROM nginx:stable-alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

Build and run:
```bash
docker build -t devtoolkit .
docker run -p 8080:80 devtoolkit
```

---

## 🔐 Security Note
Since DevToolKit processes everything locally in the browser, you don't need a backend database for the tools. However, for maximum privacy, we recommend:
- **Enabling HTTPS** (via SSL certificates like Let's Encrypt).
- **Security Headers**: Ensure your server sends `Content-Security-Policy` headers.
