import { parse } from "tldts";

const getMainDomain = () => {
  if (typeof window === "undefined") return "podly.com";

  const { domain, isIp, isLocalhost } = parse(window.location.hostname);

  // Fallback if invalid
  if (isIp || isLocalhost || !domain) return "podly.com";

  return domain;
};


const getSiteName = () => {
  if (typeof window === "undefined") return "Podly";

  const hostname = window.location.hostname;

  // Skip localhost or IP addresses
  const isIP = /^[\d.]+$/.test(hostname);
  const isLocalhost = hostname === "localhost";

  if (isIP || isLocalhost) return "Podly";

  // Get domain without subdomains (e.g. www.example.com -> example.com)
  const parts = hostname.split(".");
  const domain = parts.length > 2 ? parts.slice(-2).join(".") : hostname;

  // Use the first part of the domain (before the TLD) as the name
  const name = domain.split(".")[0];

  return name.charAt(0).toUpperCase() + name.slice(1) || "Podly";
};

const APP_NAME = getSiteName();
const APP_DOMAIN = getMainDomain();

export {APP_NAME, APP_DOMAIN};