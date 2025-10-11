# Installation Guide for Movie Web App

This guide explains how to install and configure the Movie Web App on a server or local environment.

---

## Requirements

Install these requirements first:

- **Node.js** >= 20  
- **PostgreSQL** database  
- Recommended: Nginx (for serving frontend and proxying API requests)  
- PM2 (for managing the backend service)

---

## 1. Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/YOUR_REPO.git
cd YOUR_REPO
```

If you are using a reverse proxy service such as Nginx, copy the repo files to /var/www/frontend and /var/www/backend

## 2. Backend Setup
Install Dependencies

```bash
cd Backend
```
or
```
cd /var/www/backend
```
```
npm install
```

Backend Environment Variables (.env)

Create a .env file in the Backend folder with the following content:

```
PORT=3001
DB_USER=postgres
DB_HOST=127.0.0.1
DB_NAME=moviedb
DB_PASSWORD=yourpassword
DB_PORT=5432
JWT_SECRET_KEY=your_jwt_secret
TMDB_ACCESS_TOKEN=your_tmdb_token
```

## 3. Frontend Setup

Build the frontend first, then copy it to the deployment folder.

Install Dependencies

```
cd ../Frontend
npm install
```

Frontend Environment Variables (.env)

Create .env in the Frontend folder before building:
```
VITE_API_URL=http://YOUR_SERVER_IP_OR_DOMAIN/api
```

If running locally: leave empty or use http://localhost:3001/api

If deployed on a cloud server: set to your server’s public IP or domain.

### Build Frontend

```
npm run build
```

The output will be in the dist/ folder.

Copy or serve everything under dist/ to /var/www/frontend if serving through Nginx.

## 4. PostgreSQL Database Setup

Create the database (as the postgres superuser):

```
sudo -u postgres psql -c "CREATE DATABASE moviedb;"
```
Run the initialization SQL script (moviedb.sql in the repo):
```
sudo -u postgres psql -d moviedb -f moviedb.sql
```
This will create all tables, constraints, and seed data as defined in moviedb.sql.

## 5. Run Backend

```
cd Backend
npm start
```

Or use PM2 to run as a service:
```
pm2 start index.js --name movie-backend
```
## 6. Nginx Setup (Frontend + API Proxy)

Configure a reverse proxy (in this case, Nginx) to serve the website on port 80 while routing API requests through the /api path

Add a site
```
sudo nano /etc/nginx/sites-available/movie-web-app
```
Place this in the site:
```
server {
    listen 80;
    server_name yourdomain.com;

    root /var/www/frontend;

    location / {
        try_files $uri /index.html;
    }

    location /api {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Then enable your site with a symlink to sites-enabled:
```
sudo ln -s /etc/nginx/sites-available/movie-web-app /etc/nginx/sites-enabled/
```

Reload Nginx after editing:

```
sudo systemctl reload nginx
```
