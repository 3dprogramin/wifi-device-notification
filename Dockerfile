FROM node:20-alpine

WORKDIR /app

COPY ../package*.json /
RUN npm install

COPY ../ ./

# Set environment variables here or use a .env file
# ENV ROUTER_BASE_URL=...
# ENV ROUTER_USERNAME=...
# ENV ROUTER_PASSWORD=...
# ENV RECHECK_TIME=...

CMD ["node", "index.js"]
