import { exec } from "child_process";

// sleep function
export async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Sends a desktop notification using notify-send.
 * @param {string} title
 * @param {string} message
 */
export function sendDesktopNotification(title, message) {
  exec(`notify-send "${title}" "${message.replace(/"/g, '\\"')}"`);
}