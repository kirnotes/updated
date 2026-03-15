import { CONFIG } from "./config.js";
import { initCutoffClock } from "./cutoff.js";
import { WRAPS, WRAP_HINTS, KEYWORD_HINTS, NIA_LIBRARY } from "./data.js";
import { WRAP_DETAILS } from "./wrapDetails.js";
import {
  getUserId,
  saveSession,
  getSession,
  clearSession,
  savePanels,
  loadPanels,
  getRecent,
  setRecent,
  getAnalytics,
  setAnalytics,
  saveSidebarHidden,
  getSidebarHidden
} from "./storage.js";
import { pingBackend, saveNote, fetchAnalytics, logSession } from "./api.js";

const $ = (id) => document.getElementById(id);

const els = {
  loginOverlay: $("loginOverlay"),
  loginName: $("loginName"),
  loginBtn: $("loginBtn"),
  loginError: $("loginError"),
  currentAgent: $("currentAgent"),
  logoutBtn: $("logoutBtn"),

  buildersGrid: $("buildersGrid"),
  recentList: $("recentList"),
  backendStatus: $("backendStatus"),
  copyToast: $("copyToast"),
  toggleSidebarBtn: $("toggleSidebar"),
  sidebar: $("sidebar"),
  openSheet: $("openSheet"),
  addPanelBtn: $("addPanelBtn"),
  panelCountText: $("panelCountText"),
  exportTodayHistoryBtn: $("exportTodayHistory"),
  refreshAnalyticsBtn: $("refreshAnalyticsBtn"),

  dashTotalNotes: $("dashTotalNotes"),
  dashTodayNotes: $("dashTodayNotes"),
  dashTopWrap: $("dashTopWrap"),
  dashTopKeyword: $("dashTopKeyword"),
  dashTopPanel: $("dashTopPanel"),
  panelUsageTable: $("panelUsageTable"),
  recentActivityList: $("recentActivityList"),

  cloudTodayTopWrap: $("cloudTodayTopWrap"),
  cloudTodayTopKeyword: $("cloudTodayTopKeyword"),
  cloudTodayNotes: $("cloudTodayNotes"),
  cloudUserTopWrap: $("cloudUserTopWrap"),
  cloudUserTopKeyword: $("cloudUserTopKeyword"),
  cloudUserTotalNotes: $("cloudUserTotalNotes"),
  cloudUserTodayNotes: $("cloudUserTodayNotes")
};

const appState = {
  panelIdCounter: 1,
  panels: [],
  session: getSession()
};

if (els.openSheet) {
  els.openSheet.href = CONFIG.SHEET_URL;
}

function showToast(message) {
  if (!els.copyToast) return;
  els.copyToast.textContent = message;
  els.copyToast.classList.add("show");
  setTimeout(() => els.copyToast.classList.remove("show"), 1600);
}

function escapeHtml(s) {
  return String(s)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function escapeCsv(value) {
  const text = String(value ?? "").replace(/\r?\n/g, "\n");
  return `"${text.replace(/"/g, '""')}"`;
}

function downloadFile(filename, content, mimeType) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function isSameDay(a, b) {
  return a.getFullYear() === b.getFullYear()
    && a.getMonth() === b.getMonth()
    && a.getDate() === b.getDate();
}

function normalizeMoney(value) {
  const cleaned = String(value || "").trim().replace(/[^0-9.]/g, "");
  if (!cleaned || cleaned === ".") return "";
  const parts = cleaned.split(".");
  if (parts.length === 1) return parts[0];
  return `${parts[0]}.${parts[1].slice(0, 2)}`;
}

async function copyText(text) {
  try {
    await navigator.clipboard.writeText(text);
  } catch {
    const temp = document.createElement("textarea");
    temp.value = text;
    document.body.appendChild(temp);
    temp.select();
    document.execCommand("copy");
    document.body.removeChild(temp);
  }
}

function countBy(items, getKey) {
  const out = {};
  for (const item of items) {
    const key = getKey(item);
    if (!key) continue;
    out[key] = (out[key] || 0) + 1;
  }
  return out;
}

function topEntry(counts) {
  const entries = Object.entries(counts);
  if (!entries.length) return "—";
  entries.sort((a, b) => b[1] - a[1]);
  return `${entries[0][0]} (${entries[0][1]})`;
}

function createEmptyPanelState(id) {
  return {
    id,
    wrapCode: WRAPS[0]?.name || "",
    keyword: "",
    Issue: "",
    resolution: "",
    credit: "",
    refund: "",
    output: "",
    lastCopy: ""
  };
}

function sanitizePanelState(panel, fallbackId) {
  const wrapExists = WRAPS.some((w) => w.name === panel?.wrapCode);
  const wrapCode = wrapExists ? panel.wrapCode : (WRAPS[0]?.name || "");
  const wrapObj = WRAPS.find((w) => w.name === wrapCode);
  const keywords = wrapObj ? wrapObj.keywords : [];
  const keyword = keywords.includes(panel?.keyword) ? panel.keyword : "";

  return {
    id: Number(panel?.id) || fallbackId,
    wrapCode,
    keyword,
    Issue: String(panel?.Issue || panel?.interaction || ""),
    resolution: String(panel?.resolution || ""),
    credit: String(panel?.credit || ""),
    refund: String(panel?.refund || ""),
    output: String(panel?.output || ""),
    lastCopy: String(panel?.lastCopy || "")
  };
}

function initPanels() {
  const loaded = loadPanels();
  if (!Array.isArray(loaded) || !loaded.length) {
    appState.panelIdCounter = 1;
    appState.panels = [createEmptyPanelState(1)];
    return;
  }

  const cleaned = loaded
    .slice(0, CONFIG.MAX_PANELS)
    .map((panel, index) => sanitizePanelState(panel, index + 1));

  appState.panelIdCounter = cleaned.reduce((max, p) => Math.max(max, p.id), 1);
  appState.panels = cleaned.length ? cleaned : [createEmptyPanelState(1)];
}

function savePanelsState() {
  savePanels(appState.panels);
}

function addRecent(note, wrapCode, keyword, panel) {
  const items = getRecent();
  items.unshift({
    ts: new Date().toISOString(),
    note,
    wrapCode,
    keyword,
    panel
  });
  setRecent(items.slice(0, 200));
  renderRecent();
}

function addAnalytics(event) {
  const items = getAnalytics();
  items.unshift({ ts: new Date().toISOString(), ...event });
  setAnalytics(items.slice(0, 500));
  renderLocalDashboard();
}

function renderRecent() {
  if (!els.recentList) return;
  const notes = getRecent();
  els.recentList.innerHTML = "";

  if (!notes.length) {
    els.recentList.innerHTML = `<div class="hint">No recent notes yet.</div>`;
    return;
  }

  notes.forEach((entry) => {
    const card = document.createElement("div");
    card.className = "recent-card";
    card.innerHTML = `
      <div class="recent-meta">
        Panel ${entry.panel} • ${escapeHtml(entry.keyword)} • ${escapeHtml(entry.wrapCode)} • ${new Date(entry.ts).toLocaleString()}
      </div>
      <pre class="recent-note">${escapeHtml(entry.note)}</pre>
    `;
    els.recentList.appendChild(card);
  });
}

function renderLocalDashboard() {
  const items = getAnalytics().filter((x) => x.type === "generate");
  const today = new Date();

  els.dashTotalNotes.textContent = String(items.length);
  els.dashTodayNotes.textContent = String(items.filter((x) => isSameDay(new Date(x.ts), today)).length);

  const wrapCounts = countBy(items, (x) => x.wrapCode);
  const keywordCounts = countBy(items, (x) => x.keyword);
  const panelCounts = countBy(items, (x) => `Panel ${x.panel}`);

  els.dashTopWrap.textContent = topEntry(wrapCounts);
  els.dashTopKeyword.textContent = topEntry(keywordCounts);
  els.dashTopPanel.textContent = topEntry(panelCounts);

  els.panelUsageTable.innerHTML = ["Panel 1", "Panel 2", "Panel 3"]
    .map((name) => `<tr><td>${name}</td><td>${panelCounts[name] || 0}</td></tr>`)
    .join("");

  const recent = items.slice(0, 8);
  els.recentActivityList.innerHTML = recent.length
    ? recent.map((item) => `
        <div class="activity-item">
          ${new Date(item.ts).toLocaleString()} • Panel ${item.panel} • ${escapeHtml(item.wrapCode)} • ${escapeHtml(item.keyword)}
        </div>
      `).join("")
    : `<div class="hint">No activity yet.</div>`;
}

async function renderCloudDashboard() {
  if (!appState.session?.agentName) return;

  const data = await fetchAnalytics(appState.session.agentName);
  if (!data?.ok) {
    els.cloudTodayTopWrap.textContent = "—";
    els.cloudTodayTopKeyword.textContent = "—";
    els.cloudTodayNotes.textContent = "0";
    els.cloudUserTopWrap.textContent = "—";
    els.cloudUserTopKeyword.textContent = "—";
    els.cloudUserTotalNotes.textContent = "0";
    els.cloudUserTodayNotes.textContent = "0";
    return;
  }

  els.cloudTodayTopWrap.textContent = data.todayTopWrap || "—";
  els.cloudTodayTopKeyword.textContent = data.todayTopKeyword || "—";
  els.cloudTodayNotes.textContent = String(data.todayNotes || 0);
  els.cloudUserTopWrap.textContent = data.userTopWrap || "—";
  els.cloudUserTopKeyword.textContent = data.userTopKeyword || "—";
  els.cloudUserTotalNotes.textContent = String(data.userTotalNotes || 0);
  els.cloudUserTodayNotes.textContent = String(data.userTodayNotes || 0);
}

function exportTodayHistory() {
  const notes = getRecent();
  const now = new Date();

  const todayNotes = notes.filter((entry) => isSameDay(new Date(entry.ts), now));
  if (!todayNotes.length) {
    showToast("No recent notes found for this day");
    return;
  }

  const rows = [
    ["Dates", "KIR Notes History"],
    ...todayNotes.map((entry) => [new Date(entry.ts).toLocaleString(), entry.note || ""])
  ];

  const csvContent = rows.map((row) => row.map(escapeCsv).join(",")).join("\r\n");
  const fileName = `Daily_History_${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}.csv`;
  downloadFile(fileName, csvContent, "text/csv;charset=utf-8;");
  showToast("Daily history exported");
}

function setSidebarHidden(hidden) {
  els.sidebar.classList.toggle("is-hidden", hidden);
  els.toggleSidebarBtn.textContent = hidden ? "Show menu" : "Hide menu";
  saveSidebarHidden(hidden);
}

function setSidebarHidden(hidden) {
  els.sidebar.classList.toggle("is-hidden", hidden);
  document.querySelector(".layout")?.classList.toggle("sidebar-hidden", hidden);
  els.toggleSidebarBtn.textContent = hidden ? "Show menu" : "Hide menu";
  saveSidebarHidden(hidden);
}
}

function setActiveNav() {
  const links = document.querySelectorAll(".nav a");
  function update() {
    const hash = location.hash || "#builder";
    links.forEach((link) => {
      link.classList.toggle("active", link.getAttribute("href") === hash);
    });
  }
  update();
  window.addEventListener("hashchange", update);
}

function buildFallbackIssue(wrapCode, keyword) {
  if (/cancellation/i.test(wrapCode)) {
    return "Customer expected to have the account cancelled.";
  }
  if (/skip\/unskip/i.test(wrapCode)) {
    return "Customer expected the delivery schedule to be updated.";
  }
  if (/delivery status|logistics/i.test(wrapCode)) {
    return "Customer expected an update regarding the delivery.";
  }
  if (/quality/i.test(wrapCode)) {
    return "Customer expected to have a full meal to be edible, but there was a quality concern.";
  }
  if (/pick & pack/i.test(wrapCode)) {
    return "Customer expected the correct ingredients, but there was a missing or incorrect item.";
  }
  return keyword ? `Customer contacted us regarding ${keyword}.` : "Customer contacted us regarding the account.";
}

function buildFallbackResolution(wrapCode, keyword) {
  if (/cancellation/i.test(wrapCode)) {
    return "I reviewed the concern and informed cx of the cancellation outcome.";
  }
  if (/skip\/unskip/i.test(wrapCode)) {
    return "I updated the schedule in OWL.";
  }
  if (/credit|refund/i.test(wrapCode)) {
    return "I reviewed the account and informed cx of the payment outcome.";
  }
  if (/pick & pack/i.test(wrapCode)) {
    return "I processed the appropriate outcome and advised NIA if applicable.";
  }
  if (/quality/i.test(wrapCode)) {
    return "I processed the appropriate quality outcome.";
  }
  if (/update account|subscription details/i.test(wrapCode)) {
    return "I updated the account in OWL or informed cx of the next steps.";
  }
  if (/connection issue/i.test(wrapCode)) {
    return "No resolution provided.";
  }
  return "I reviewed the concern and provided the appropriate support.";
}

function getHintPair(wrap, keyword) {
  if (KEYWORD_HINTS[keyword]) return KEYWORD_HINTS[keyword];
  if (WRAP_HINTS[wrap]) return WRAP_HINTS[wrap];
  return {
    Issue: buildFallbackIssue(wrap, keyword),
    resolution: buildFallbackResolution(wrap, keyword)
  };
}

function buildMoneyText(panelState) {
  const creditVal = normalizeMoney(panelState.credit);
  const refundVal = normalizeMoney(panelState.refund);
  let text = "";

  if (creditVal) {
    text += `${text ? " " : ""}Credited $${creditVal}. Advised cx where to find the credit on the account.`;
  }

  if (refundVal) {
    text += `${text ? " " : ""}Refunded $${refundVal}.`;
  }

  return text.trim();
}

function buildOutput(panelState) {
  const rBase = panelState.resolution.trim();
  const money = buildMoneyText(panelState);
  const rText = [rBase, money].filter(Boolean).join(" ").trim();
  return `K- ${panelState.keyword || ""}\nI- ${panelState.Issue.trim()}\nR- ${rText}`;
}

function appendNiaResolutionText(panelState) {
  const niaLine = "Provided NIA to the customer.";
  const current = String(panelState.resolution || "").trim();
  if (!current) {
    panelState.resolution = niaLine;
    return;
  }
  if (!current.toLowerCase().includes(niaLine.toLowerCase())) {
    panelState.resolution = `${current} ${niaLine}`;
  }
}

function getNiaText(wrapCode, keyword, brand) {
  const wrapBucket = NIA_LIBRARY[wrapCode];
  if (!wrapBucket) return "";
  const keywordBucket = wrapBucket[keyword];
  if (!keywordBucket) return "";
  return keywordBucket[brand] || "";
}

async function copyNiaForBrand(panelState, brand, panelNumber) {
  if (!panelState.keyword) {
    showToast(`Panel ${panelNumber}: select 1 keyword first`);
    return;
  }

  const niaText = getNiaText(panelState.wrapCode, panelState.keyword, brand);
  if (!niaText) {
    showToast(`Panel ${panelNumber}: no ${brand.toUpperCase()} NIA for this keyword`);
    return;
  }

  appendNiaResolutionText(panelState);
  panelState.output = buildOutput(panelState);

  await copyText(niaText);
  savePanelsState();
  renderPanels();
  showToast(`Panel ${panelNumber}: ${brand.toUpperCase()} NIA copied`);
}

function renderKeywords(container, keywords, selectedKeyword, onClick) {
  container.innerHTML = "";
  keywords.forEach((keyword) => {
    const chip = document.createElement("button");
    chip.type = "button";
    chip.className = `chip${selectedKeyword === keyword ? " active" : ""}`;
    chip.textContent = keyword;
    chip.addEventListener("click", () => onClick(keyword));
    container.appendChild(chip);
  });
}

function buildPanelTemplate(index, panelState, canRemove) {
  return `
    <div class="builder-card" data-panel-id="${panelState.id}">
      <div class="builder-head">
        <div class="builder-head-left">
          <h3>Customer ${index + 1}</h3>
          <div class="builder-badge">Live preview</div>
        </div>
        <div class="builder-head-actions">
          ${canRemove ? `<button type="button" class="remove-panel-btn">Remove</button>` : ``}
        </div>
      </div>

      <label>Wrap Code</label>
      <select class="wrap-select"></select>

      <div class="wrap-guide-box">
        <div class="wrap-guide-title">WRAP CODE</div>
        <div class="wrap-guide-selected">
          <span class="wrap-guide-current">${escapeHtml(panelState.wrapCode || "—")}</span>
        </div>
        <div class="wrap-guide-text">${escapeHtml(WRAP_DETAILS[panelState.wrapCode] || "No wrap description available.")}</div>
      </div>

      <label>Keyword (ONLY ONE)</label>
      <div class="chips keyword-container"></div>
      <div class="hint">Click one keyword. Choosing another replaces it.</div>

      <div class="nia-box">
        <div class="nia-title">NIA Buttons</div>
        <div class="row">
          <button type="button" class="btn secondary copy-nia-hf-btn">Copy NIA HF</button>
          <button type="button" class="btn secondary copy-nia-ep-btn">Copy NIA EveryPlate</button>
          <button type="button" class="btn secondary copy-nia-general-btn">Copy General NIA</button>
        </div>
      </div>

      <div class="hint-card">
        <label>Issue Hint</label>
        <textarea class="Issue-hint" readonly></textarea>
        <div class="row">
          <button type="button" class="btn secondary use-Issue-hint">Use</button>
        </div>
      </div>

      <div class="hint-card">
        <label>Resolution Hint</label>
        <textarea class="resolution-hint" readonly></textarea>
        <div class="row">
          <button type="button" class="btn secondary use-resolution-hint">Use</button>
        </div>
      </div>

      <label>Issue</label>
      <textarea class="Issue" placeholder="Type Issue note here..."></textarea>

      <label>Resolution</label>
      <textarea class="resolution" placeholder="Type resolution note here..."></textarea>

      <div class="grid2">
        <div>
          <label>Credit Amount (optional)</label>
          <input class="credit" type="text" placeholder="e.g. 12.00">
        </div>
        <div>
          <label>Refund Amount (optional)</label>
          <input class="refund" type="text" placeholder="e.g. 10.99">
        </div>
      </div>

      <div class="row">
        <button type="button" class="btn generate-btn">Generate + Auto-Copy</button>
        <button type="button" class="btn secondary copy-btn">Copy Again</button>
        <button type="button" class="btn secondary clear-btn">Clear</button>
      </div>

      <label>Output</label>
      <textarea class="output" readonly></textarea>

      <div class="preview-line">
        <strong>Selected:</strong>
        <span class="selected-wrap">—</span>
        /
        <span class="selected-keyword">—</span>
        /
        Last Copy:
        <span class="last-copy">—</span>
      </div>
    </div>
  `;
}

function renderSinglePanel(index, panelState) {
  const wrapper = document.createElement("div");
  wrapper.innerHTML = buildPanelTemplate(index, panelState, appState.panels.length > 1);
  const panelEl = wrapper.firstElementChild;

  const wrapSelect = panelEl.querySelector(".wrap-select");
  const keywordContainer = panelEl.querySelector(".keyword-container");
  const issueEl = panelEl.querySelector(".Issue");
  const resolutionEl = panelEl.querySelector(".resolution");
  const creditEl = panelEl.querySelector(".credit");
  const refundEl = panelEl.querySelector(".refund");
  const outputEl = panelEl.querySelector(".output");
  const issueHintEl = panelEl.querySelector(".Issue-hint");
  const resolutionHintEl = panelEl.querySelector(".resolution-hint");
  const selectedWrapEl = panelEl.querySelector(".selected-wrap");
  const selectedKeywordEl = panelEl.querySelector(".selected-keyword");
  const lastCopyEl = panelEl.querySelector(".last-copy");

  WRAPS.slice().sort((a, b) => a.name.localeCompare(b.name)).forEach((w) => {
    const opt = document.createElement("option");
    opt.value = w.name;
    opt.textContent = w.name;
    wrapSelect.appendChild(opt);
  });

  wrapSelect.value = panelState.wrapCode;
  issueEl.value = panelState.Issue;
  resolutionEl.value = panelState.resolution;
  creditEl.value = panelState.credit;
  refundEl.value = panelState.refund;
  outputEl.value = buildOutput(panelState);
  lastCopyEl.textContent = panelState.lastCopy || "—";

  function syncHintsAndMeta() {
    selectedWrapEl.textContent = panelState.wrapCode || "—";
    selectedKeywordEl.textContent = panelState.keyword || "—";

    if (!panelState.keyword) {
      issueHintEl.value = "";
      resolutionHintEl.value = "";
    } else {
      const pair = getHintPair(panelState.wrapCode, panelState.keyword);
      issueHintEl.value = pair.Issue || "";
      resolutionHintEl.value = pair.resolution || "";
    }
  }

  function syncOutput() {
    panelState.output = buildOutput(panelState);
    outputEl.value = panelState.output;
  }

  function renderPanelKeywords() {
    const wrapObj = WRAPS.find((w) => w.name === panelState.wrapCode);
    const keywords = wrapObj ? wrapObj.keywords : [];

    renderKeywords(keywordContainer, keywords, panelState.keyword, (keyword) => {
      panelState.keyword = panelState.keyword === keyword ? "" : keyword;
      savePanelsState();
      renderPanels();
    });
  }

  wrapSelect.addEventListener("change", () => {
    panelState.wrapCode = wrapSelect.value;
    const wrapObj = WRAPS.find((w) => w.name === panelState.wrapCode);
    if (!wrapObj || !wrapObj.keywords.includes(panelState.keyword)) {
      panelState.keyword = "";
    }
    savePanelsState();
    renderPanels();
  });

  issueEl.addEventListener("input", () => {
    panelState.Issue = issueEl.value;
    syncOutput();
    savePanelsState();
  });

  resolutionEl.addEventListener("input", () => {
    panelState.resolution = resolutionEl.value;
    syncOutput();
    savePanelsState();
  });

  creditEl.addEventListener("input", () => {
    panelState.credit = creditEl.value;
    syncOutput();
    savePanelsState();
  });

  refundEl.addEventListener("input", () => {
    panelState.refund = refundEl.value;
    syncOutput();
    savePanelsState();
  });

  panelEl.querySelector(".use-Issue-hint").addEventListener("click", () => {
    if (!issueHintEl.value.trim()) return;
    panelState.Issue = issueHintEl.value;
    savePanelsState();
    renderPanels();
  });

  panelEl.querySelector(".use-resolution-hint").addEventListener("click", () => {
    if (!resolutionHintEl.value.trim()) return;
    panelState.resolution = resolutionHintEl.value;
    savePanelsState();
    renderPanels();
  });

  panelEl.querySelector(".copy-nia-hf-btn").addEventListener("click", async () => {
    await copyNiaForBrand(panelState, "hf", index + 1);
  });

  panelEl.querySelector(".copy-nia-ep-btn").addEventListener("click", async () => {
    await copyNiaForBrand(panelState, "everyplate", index + 1);
  });

  panelEl.querySelector(".copy-nia-general-btn").addEventListener("click", async () => {
    await copyNiaForBrand(panelState, "general", index + 1);
  });

  panelEl.querySelector(".generate-btn").addEventListener("click", async () => {
    if (!appState.session?.agentName) {
      showToast("Please log in first");
      return;
    }

    if (!panelState.keyword) {
      showToast(`Panel ${index + 1}: select 1 keyword first`);
      return;
    }

    panelState.output = buildOutput(panelState);
    outputEl.value = panelState.output;

    await copyText(panelState.output);
    panelState.lastCopy = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

    const payload = {
      timestamp: new Date().toISOString(),
      localDate: new Date().toLocaleDateString("en-CA"),
      userId: getUserId(),
      agentName: appState.session.agentName,
      panel: index + 1,
      wrapCode: panelState.wrapCode,
      keyword: panelState.keyword,
      Issue: panelState.Issue.trim(),
      resolution: panelState.resolution.trim(),
      credit: normalizeMoney(panelState.credit),
      refund: normalizeMoney(panelState.refund),
      finalNote: panelState.output
    };

    const result = await saveNote(payload);

    addRecent(panelState.output, panelState.wrapCode, panelState.keyword, index + 1);
    addAnalytics({
      type: "generate",
      panel: index + 1,
      wrapCode: panelState.wrapCode,
      keyword: panelState.keyword,
      agentName: appState.session.agentName
    });

    savePanelsState();
    renderPanels();
    renderCloudDashboard();

    showToast(result?.ok ? `Panel ${index + 1}: copied + saved` : `Panel ${index + 1}: copied, sheet save failed`);
  });

  panelEl.querySelector(".copy-btn").addEventListener("click", async () => {
    if (!panelState.output.trim()) {
      showToast(`Panel ${index + 1}: nothing to copy`);
      return;
    }

    await copyText(panelState.output);
    panelState.lastCopy = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    savePanelsState();
    renderPanels();
    showToast(`Panel ${index + 1}: copied`);
  });

  panelEl.querySelector(".clear-btn").addEventListener("click", () => {
    panelState.keyword = "";
    panelState.Issue = "";
    panelState.resolution = "";
    panelState.credit = "";
    panelState.refund = "";
    panelState.output = "";
    panelState.lastCopy = "";
    savePanelsState();
    renderPanels();
    showToast(`Panel ${index + 1}: cleared`);
  });

  const removeBtn = panelEl.querySelector(".remove-panel-btn");
  if (removeBtn) {
    removeBtn.addEventListener("click", () => {
      if (appState.panels.length <= 1) return;
      appState.panels = appState.panels.filter((p) => p.id !== panelState.id);
      savePanelsState();
      renderPanels();
      showToast(`Removed panel ${index + 1}`);
    });
  }

  syncHintsAndMeta();
  syncOutput();
  renderPanelKeywords();

  return panelEl;
}

function updatePanelCountText() {
  els.panelCountText.textContent = `${appState.panels.length} of ${CONFIG.MAX_PANELS} panels in use`;
  els.addPanelBtn.disabled = appState.panels.length >= CONFIG.MAX_PANELS;
  els.addPanelBtn.style.opacity = appState.panels.length >= CONFIG.MAX_PANELS ? "0.6" : "1";
  els.addPanelBtn.style.cursor = appState.panels.length >= CONFIG.MAX_PANELS ? "not-allowed" : "pointer";
}

function renderPanels() {
  els.buildersGrid.innerHTML = "";
  els.buildersGrid.dataset.panels = String(appState.panels.length);
  appState.panels.forEach((panelState, index) => {
    els.buildersGrid.appendChild(renderSinglePanel(index, panelState));
  });
  updatePanelCountText();
}

function addPanel() {
  if (appState.panels.length >= CONFIG.MAX_PANELS) {
    showToast(`Maximum of ${CONFIG.MAX_PANELS} panels`);
    return;
  }
  appState.panelIdCounter += 1;
  appState.panels.push(createEmptyPanelState(appState.panelIdCounter));
  savePanelsState();
  renderPanels();
  showToast(`Added panel ${appState.panels.length}`);
}

function setSessionUI() {
  const name = appState.session?.agentName || "—";
  els.currentAgent.textContent = name;

  if (appState.session?.agentName) {
    els.loginOverlay.classList.add("hidden");
  } else {
    els.loginOverlay.classList.remove("hidden");
  }
}

async function handleLogin() {
  const agentName = els.loginName.value.trim();
  if (!agentName) {
    els.loginError.textContent = "Please enter your name.";
    return;
  }

  appState.session = {
    agentName,
    userId: getUserId(),
    loggedInAt: new Date().toISOString()
  };

  saveSession(appState.session);
  setSessionUI();
  els.loginError.textContent = "";

  await logSession({
    type: "login",
    agentName,
    userId: appState.session.userId
  });

  renderCloudDashboard();
  showToast(`Logged in as ${agentName}`);
}

async function handleLogout() {
  const current = appState.session;
  if (current?.agentName) {
    await logSession({
      type: "logout",
      agentName: current.agentName,
      userId: current.userId
    });
  }

  clearSession();
  appState.session = null;
  els.loginName.value = "";
  setSessionUI();
  showToast("Logged out");
}

async function initBackendStatus() {
  const result = await pingBackend();
  els.backendStatus.textContent = result?.ok ? "Connected ✔" : "Not connected";
}

function bindEvents() {
  els.toggleSidebarBtn.addEventListener("click", () => {
    setSidebarHidden(!els.sidebar.classList.contains("is-hidden"));
  });

  els.addPanelBtn.addEventListener("click", addPanel);
  els.exportTodayHistoryBtn.addEventListener("click", exportTodayHistory);
  els.refreshAnalyticsBtn.addEventListener("click", renderCloudDashboard);
  els.loginBtn.addEventListener("click", handleLogin);
  els.logoutBtn.addEventListener("click", handleLogout);

  els.loginName.addEventListener("keydown", (e) => {
    if (e.key === "Enter") handleLogin();
  });

  window.addEventListener("error", (e) => {
    console.error("JS error:", e.message, "at", e.filename, "line", e.lineno);
  });
}

function init() {
  initPanels();
  loadSidebarState();
  setActiveNav();
  setSessionUI();
  bindEvents();
  renderPanels();
  renderRecent();
  renderLocalDashboard();
  initBackendStatus();
  initCutoffClock();

  if (appState.session?.agentName) {
    renderCloudDashboard();
  }
}

init();
