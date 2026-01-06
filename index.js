import logger from "./modules/logger.js";
import { sleep } from "./modules/utils.js";
import router from "./modules/router.js";
import storage from "./modules/storage.js";
import { sendNotification } from "./modules/discord.js";

const ROUTER_BASE_URL = process.env.ROUTER_BASE_URL;
const ROUTER_USERNAME = process.env.ROUTER_USERNAME;
const ROUTER_PASSWORD = process.env.ROUTER_PASSWORD;
const RECHECK_TIME = parseInt(process.env.RECHECK_TIME) || 60;

async function run() {
  try {
    const storedDevices = await storage.readDevices();
    logger.debug("Checking wifi devices...");
    // login to get the uuid cookie
    const uuid = await router.login(
      ROUTER_BASE_URL,
      ROUTER_USERNAME,
      ROUTER_PASSWORD
    );
    // get the list of connected devices
    const currentDevices = await router.getDevices(ROUTER_BASE_URL, uuid);

    // go through all devices and see if there are any new ones
    let newDeviceFound = false;
    for (const device of currentDevices) {
      const isNewDevice = !storedDevices.some((d) => d.mac.toLowerCase() === device.mac.toLowerCase());
      if (isNewDevice) {
        newDeviceFound = true;
        // send discord notification and log
        const message = `New device connected to WiFi: ${device.name} (${device.manufacturer}) - ${device.mac}`;
        await sendNotification(process.env.DISCORD_WEBHOOK_URL, message);
        logger.info(message);

        // append device to storage and save
        storedDevices.push(device);
        await storage.writeDevices(storedDevices);
      }
    }

    if (!newDeviceFound) {
      logger.debug(
        `No new devices found [${currentDevices.length} devices connected / ${storedDevices.length} stored in local DB]`
      );
    }

    logger.debug("Check complete");
  } catch (err) {
    logger.error("Error occurred during check:", err);
  }
}

async function main() {
  logger.info("Wifi device notification script started");

  // run continuously, checking every RECHECK_TIME seconds
  while (true) {
    await run();
    logger.debug(`Sleeping for ${RECHECK_TIME} seconds...`);
    await sleep(RECHECK_TIME * 1000);
  }
}

main();
