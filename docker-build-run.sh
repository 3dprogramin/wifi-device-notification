#!/bin/bash

docker build -t wifi-device-notification .

docker run -d \
--restart unless-stopped \
-v "./db.txt:/app/db.txt" \
-e ROUTER_BASE_URL="http://192.168.1.1" \
-e ROUTER_USERNAME=admin \
-e ROUTER_PASSWORD=your_password_hash \
-e RECHECK_TIME=60 \
-e DISCORD_WEBHOOK_URL="https://discord.com/api/webhooks/123456789/abcdef-ghi-1234567" \
wifi-device-notification:latest