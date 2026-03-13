import { CONFIG } from "./config.js";

const { STORAGE_KEYS } = CONFIG;

export function getUserId() {
  let id = localStorage.getItem(STORAGE_KEYS.USER_ID);
  if (!id) {
    id = `u_${Math.random().toString(16).slice(2)}_${Date.now()}`;
    localStorage.setItem(STORAGE_KEYS.USER_ID, id);
  }
  return id;
}

export function saveSession(session) {
  localStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify(session || null));
}

export function getSession() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.SESSION) || "null");
  } catch {
    return null;
  }
}

export function clearSession() {
  localStorage.removeItem(STORAGE_KEYS.SESSION);
}

export function savePanels(panels) {
  localStorage.setItem(STORAGE_KEYS.PANELS, JSON.stringify(panels));
}

export function loadPanels() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.PANELS) || "[]");
  } catch {
    return [];
  }
}

export function getRecent() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.RECENT) || "[]");
  } catch {
    return [];
  }
}

export function setRecent(items) {
  localStorage.setItem(STORAGE_KEYS.RECENT, JSON.stringify(items));
}

export function getAnalytics() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.ANALYTICS) || "[]");
  } catch {
    return [];
  }
}

export function setAnalytics(items) {
  localStorage.setItem(STORAGE_KEYS.ANALYTICS, JSON.stringify(items));
}

export function saveSidebarHidden(hidden) {
  localStorage.setItem(STORAGE_KEYS.SIDEBAR, hidden ? "1" : "0");
}

export function getSidebarHidden() {
  return localStorage.getItem(STORAGE_KEYS.SIDEBAR) === "1";
}