export const DEFAULT_BROWSER_URL = "http://localhost:3000";

export function extractHostname(url: string): string {
  // find & remove protocol
  let hostname = url.indexOf("//") > -1 ? url.split("/")[2] : url.split("/")[0];
  // find & remove port number
  hostname = hostname.split(":")[0];
  // find & remove query string
  hostname = hostname.split("?")[0];
  return hostname;
}

export function getBrowserUrl() {
  return typeof window === "undefined" || typeof window.location === "undefined"
    ? DEFAULT_BROWSER_URL
    : window.location.href;
}

export function listObject(obj: any) {
  return Object.keys(obj).map((key) => {
    return `${key}: ${obj[key]}`;
  });
}
