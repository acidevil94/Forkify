import "regenerator-runtime";
import "core-js/stable";
import { REQUEST_TIMEOUT_SEC } from "./config.js";

export const getJSON = async function (url) {
  try {
    const res = await Promise.race([fetch(url), timeout(REQUEST_TIMEOUT_SEC)]);
    const data = await res.json();

    if (!res.ok) {
      throw new Error(`${data.message} (${res.status})`);
    }
    return data;
  } catch (err) {
    throw err;
  }
};

export const timeout = function (s) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error(`Request took too long! Timeout after ${s} second`));
    }, s * 1000);
  });
};
