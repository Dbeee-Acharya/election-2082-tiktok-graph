# 1. Copy the build output (from your local machine)
rsync -av .output/ user@your-vps:/var/www/election/

# 2. On the VPS — install PM2 globally (once)
npm install -g pm2

# 3. Start the app
PORT=3000 pm2 start /var/www/election/server/index.mjs --name election

# 4. Save process list so it survives reboots
pm2 save
pm2 startup   # follow the printed command


server {
    listen 80;
    server_name yourdomain.com;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
