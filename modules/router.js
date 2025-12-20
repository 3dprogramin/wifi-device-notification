import axios from "axios";
import crypto from "crypto";
import macOuiLookup from 'mac-oui-lookup';

const JSONAPI = "/cgi-bin/JSONAPI";

export async function login(baseUrl, username, password) {
  const url = `${baseUrl}${JSONAPI}`;
  const data = {
    cmdType: "SET_WEB_LOGIN",
    username: username,
    password: password,
  };
  let res;
  try {
  res = await axios.post(url, data, {
    headers: {
      "Content-Type": "application/json",
      "User-Agent": "Mozilla/5.0 (X11; Linux x86_64; rv:147.0) Gecko/20100101 Firefox/147.0",
    }
  });

  if (res.data.ret !== 0) {
    throw new Error("Router login failed");
  }
  return res.data.uuid;
} catch (err) {
  throw new Error(`Router login error: ${err.message}`);
}
}

function generateXsrf(uuid, payload) {
  return crypto
    .createHmac("sha256", uuid)   // key = uuid
    .update(payload)              // message = payload
    .digest("hex");               // hex output
}

export async function getDevices(baseUrl, uuid) {
  const xsrfToken = generateXsrf(uuid, '{"cmdType":"GET_DEVICES_TOPO"}');
  const res = await axios.post(
    `${baseUrl}${JSONAPI}`,
    { cmdType: "GET_DEVICES_TOPO" },
    {
      headers: {
        Cookie: `uuid=${uuid}; userType=0; username=admin`,
        "User-Agent": "Mozilla/5.0 (X11; Linux x86_64; rv:147.0) Gecko/20100101 Firefox/147.0",
        "Content-Type": "application/json",
        "X-Xsrf-Token": xsrfToken,
      },
    }
  );

  if (res.data.ret !== 0) {
    throw new Error("Failed to fetch devices");
  }

  return res.data.lanDeviceLists.map((device) => ({
    name: device.HostName || "unknown",
    type: device.DeviceType,
    manufacturer: macOuiLookup.getVendor(device.MACAddress),
    mac: device.MACAddress,
  }));
}

export default {
  login,
  getDevices,
};
