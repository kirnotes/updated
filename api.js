import { CONFIG } from "./config.js";

function toQuery(params = {}) {
  const url = new URL(CONFIG.APPS_SCRIPT_WEBAPP_URL);
  Object.entries(params).forEach(([key, value]) => {
    url.searchParams.set(key, String(value ?? ""));
  });
  return url.toString();
}

export async function pingBackend() {
  try {
    const res = await fetch(toQuery({ action: "ping" }));
    return await res.json();
  } catch (error) {
    return { ok: false, error: String(error) };
  }
}

export async function logSession({ type, agentName, userId }) {
  try {
    const body = new URLSearchParams({
      action: type,
      agentName,
      userId,
      timestamp: new Date().toISOString(),
      localDate: new Date().toLocaleDateString("en-CA")
    });

    const res = await fetch(CONFIG.APPS_SCRIPT_WEBAPP_URL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8" },
      body: body.toString()
    });

    return await res.json();
  } catch (error) {
    return { ok: false, error: String(error) };
  }
}

export async function saveNote(payload) {
  try {
    const body = new URLSearchParams({
      action: "saveNote",
      ...Object.fromEntries(
        Object.entries(payload).map(([k, v]) => [k, String(v ?? "")])
      )
    });

    const res = await fetch(CONFIG.APPS_SCRIPT_WEBAPP_URL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8" },
      body: body.toString()
    });

    return await res.json();
  } catch (error) {
    return { ok: false, error: String(error) };
  }
}

export async function fetchAnalytics(agentName) {
  try {
    const res = await fetch(toQuery({
      action: "analytics",
      agentName,
      localDate: new Date().toLocaleDateString("en-CA")
    }));
    return await res.json();
  } catch (error) {
    return { ok: false, error: String(error) };
  }
}