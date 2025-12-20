# WiFi Device Notification

A Node.js script that monitors connected WiFi devices on your router and sends notifications (e.g., to Discord) when new devices connect. Runs easily as a Docker container and persists device data in `db.txt`.

---

## Features

- Periodically checks your router for connected devices
- Notifies via Discord webhook when a new device connects
- Persists known devices in `db.txt`
- Runs as a Docker container or directly with Node.js

---

## Requirements

- Node.js 20+ (if running without Docker)
- Docker (recommended)
- A router with a compatible JSON API (see `modules/router.js`)
- Discord webhook URL for notifications

---

## Setup

### 1. Clone the repository

```sh
git clone https://github.com/yourusername/wifi-device-notification.git
cd wifi-device-notification
```

### 2. Configure Environment Variables

You can set these as environment variables or in your Docker run command:

- `ROUTER_BASE_URL` – Base URL of your router (e.g., `http://192.168.1.1`)
- `ROUTER_USERNAME` – Router admin username
- `ROUTER_PASSWORD` – Router admin password
- `RECHECK_TIME` – (optional) Seconds between checks (default: 60)
- `DISCORD_WEBHOOK_URL` – Discord webhook for notifications

### 3. Prepare `db.txt`

Create an empty `db.txt` file in the project root if it doesn't exist:

```sh
touch db.txt
```

---

## Running with Docker

### Build and Run

```sh
./docker-build-run.sh
```

This script will:

- Build the Docker image
- Modify / set the environment variables
- Run the container, mounting `db.txt` for persistent storage

---

## Running without Docker

```sh
npm install
node index.js
```

Set environment variables as needed.

---

## File Structure

```
.
├── db.txt
├── index.js
├── modules/
│   ├── router.js
│   ├── utils.js
│   ├── logger.js
│   ├── storage.js
│   └── discord.js
├── Dockerfile
├── docker-build-run.sh
└── README.md
```

---

## License

MIT

---

## Disclaimer

- This script is designed for the DIGI router **SR1041Y_R1A**
- Use responsibly and at your own risk.
