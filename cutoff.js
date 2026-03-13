const CUT_OFF_RULES = {
  "HelloFresh": {
    deliveryDays: ["Sat", "Sun", "Mon", "Tue", "Wed", "Thu", "Fri"],
    cutoffDays: {
      "Sat": "Prev Mon",
      "Sun": "Prev Tue",
      "Mon": "Prev Wed",
      "Tue": "Prev Thu",
      "Wed": "Prev Fri",
      "Thu": "Prev Sat",
      "Fri": "Prev Sun"
    },
    cutoffTime: "11:59 PM PDT",
    internalCutoff: "11:59 PM PDT",
    graceActions: {
      Initial: ["Box Cancellation", "Meal Selection", "Delivery Address Change"],
      Recurring: ["Meal Selection", "Delivery Address Change"]
    }
  },
  "EveryPlate": {
    deliveryDays: ["Sat", "Sun", "Mon", "Tue", "Wed", "Thu", "Fri"],
    cutoffDays: {
      "Sat": "Prev Mon",
      "Sun": "Prev Tue",
      "Mon": "Prev Wed",
      "Tue": "Prev Thu",
      "Wed": "Prev Fri",
      "Thu": "Prev Sat",
      "Fri": "Prev Sun"
    },
    cutoffTime: "11:59 PM PDT",
    internalCutoff: "11:59 PM PDT",
    graceActions: {
      Initial: ["Box Cancellation", "Meal Selection", "Delivery Address Change"],
      Recurring: ["Meal Selection", "Delivery Address Change"]
    }
  },
  "Green Chef": {
    deliveryDays: ["Sat", "Sun", "Mon", "Tue", "Wed", "Thu", "Fri"],
    cutoffDays: {
      "Sat": "Prev Mon",
      "Sun": "Prev Tue",
      "Mon": "Prev Wed",
      "Tue": "Prev Thu",
      "Wed": "Prev Fri",
      "Thu": "Prev Sat",
      "Fri": "Prev Sun"
    },
    cutoffTime: "11:59 PM PDT",
    internalCutoff: "11:59 PM PDT",
    graceActions: {
      Initial: ["Box Cancellation", "Meal Selection", "Delivery Address Change"],
      Recurring: ["Meal Selection", "Delivery Address Change"]
    }
  },
  "Factor 75": {
    deliveryDays: ["Sat", "Sun", "Mon", "Tue"],
    cutoffDays: {
      "Sat": "Prev Mon",
      "Sun": "Prev Tue",
      "Mon": "Prev Wed",
      "Tue": "Prev Wed"
    },
    cutoffTime: "11:59 PM PDT",
    internalCutoff: "11:59 PM PDT",
    graceActions: {
      Initial: [],
      Recurring: []
    }
  },
  "Factor Form": {
    deliveryDays: ["Sat", "Sun", "Mon"],
    cutoffDays: {
      "Sat": "Prev Mon",
      "Sun": "Prev Tue",
      "Mon": "Prev Wed"
    },
    cutoffTime: "Unavailable",
    internalCutoff: "Unavailable",
    graceActions: {
      Initial: ["Box Cancellation", "Meal Selection", "Delivery Address Change"],
      Recurring: ["Meal Selection", "Delivery Address Change"]
    }
  },
  "Good Chop": {
    deliveryDays: ["Tue", "Wed", "Thu", "Fri"],
    cutoffDays: {
      "Tue": "Prev Fri",
      "Wed": "Prev Sat",
      "Thu": "Prev Sun",
      "Fri": "Prev Mon"
    },
    cutoffTime: "11:59 PM PDT",
    internalCutoff: "11:59 PM PDT",
    graceActions: {
      Initial: ["Box Cancellation", "Meal Selection", "Delivery Address Change"],
      Recurring: ["Meal Selection", "Delivery Address Change"]
    }
  },
  "The Pets Table": {
    deliveryDays: ["Mon", "Tue", "Wed", "Thu", "Fri"],
    cutoffDays: {
      "Mon": "Prev Wed",
      "Tue": "Prev Thu",
      "Wed": "Prev Thu",
      "Thu": "Prev Sun",
      "Fri": "Prev Mon"
    },
    cutoffTime: "11:59 PM PDT",
    internalCutoff: "10:29 AM PDT",
    graceActions: {
      Initial: ["Box Cancellation"],
      Recurring: ["Box Cancellation"]
    }
  }
};

const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function formatEasternTime() {
  return new Date().toLocaleString("en-US", {
    timeZone: "America/New_York",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric"
  });
}

function getSelectedDateInfo(dateStr) {
  const d = new Date(`${dateStr}T12:00:00`);
  const dayName = DAY_NAMES[d.getDay()];
  return { date: d, dayName };
}

function getPrevDayName(targetDayName) {
  const idx = DAY_NAMES.indexOf(targetDayName);
  return idx <= 0 ? DAY_NAMES[6] : DAY_NAMES[idx - 1];
}

function renderBrandCards() {
  const container = document.getElementById("cutoffBrandCards");
  const dateInput = document.getElementById("cutoffDeliveryDate");
  if (!container || !dateInput || !dateInput.value) return;

  const { dayName } = getSelectedDateInfo(dateInput.value);
  const now = new Date();

  container.innerHTML = Object.entries(CUT_OFF_RULES).map(([brand, config]) => {
    const delivers = config.deliveryDays.includes(dayName);

    if (!delivers) {
      return `
        <div class="cutoff-card">
          <div class="cutoff-card-head">
            <div class="cutoff-brand">${brand}</div>
            <div class="cutoff-pill na">NO DELIVERIES</div>
          </div>
        </div>
      `;
    }

    const cutoffRule = config.cutoffDays[dayName] || "—";

    return `
      <div class="cutoff-card">
        <div class="cutoff-card-head">
          <div class="cutoff-brand">${brand}</div>
          <div class="cutoff-pill after">CHECK RULES</div>
        </div>
        <div class="cutoff-meta">Customer Cutoff: ${cutoffRule}, ${config.cutoffTime}</div>
        <div class="cutoff-meta">Internal Cutoff: ${cutoffRule}, ${config.internalCutoff}</div>
        <div class="cutoff-meta">Selected Delivery Day: ${dayName}</div>
      </div>
    `;
  }).join("");
}

function renderDeliveryScheduleTable() {
  const el = document.getElementById("deliveryScheduleTable");
  if (!el) return;

  const days = ["Sat", "Sun", "Mon", "Tue", "Wed", "Thu", "Fri"];

  el.innerHTML = `
    <table>
      <thead>
        <tr>
          <th>Brand</th>
          ${days.map(d => `<th>${d}</th>`).join("")}
        </tr>
      </thead>
      <tbody>
        ${Object.entries(CUT_OFF_RULES).map(([brand, config]) => `
          <tr>
            <td>${brand}</td>
            ${days.map(day => `<td>${config.deliveryDays.includes(day) ? "✓" : "—"}</td>`).join("")}
          </tr>
        `).join("")}
      </tbody>
    </table>
  `;
}

function renderCutoffRulesTable() {
  const el = document.getElementById("cutoffRulesTable");
  if (!el) return;

  const days = ["Sat", "Sun", "Mon", "Tue", "Wed", "Thu", "Fri"];

  el.innerHTML = `
    <table>
      <thead>
        <tr>
          <th>Brand</th>
          ${days.map(d => `<th>${d}</th>`).join("")}
        </tr>
      </thead>
      <tbody>
        ${Object.entries(CUT_OFF_RULES).map(([brand, config]) => `
          <tr>
            <td>${brand}</td>
            ${days.map(day => `<td>${config.cutoffDays[day] || "—"}</td>`).join("")}
          </tr>
        `).join("")}
      </tbody>
    </table>
  `;
}

function renderGracePeriodTable() {
  const el = document.getElementById("gracePeriodTable");
  if (!el) return;

  const cols = [
    "Box Cancellation",
    "Meal Selection",
    "Delivery Address Change"
  ];

  el.innerHTML = `
    <table>
      <thead>
        <tr>
          <th>Brand</th>
          <th>Type</th>
          ${cols.map(c => `<th>${c}</th>`).join("")}
        </tr>
      </thead>
      <tbody>
        ${Object.entries(CUT_OFF_RULES).map(([brand, config]) => `
          ${["Initial", "Recurring"].map(type => `
            <tr>
              <td>${brand}</td>
              <td>${type}</td>
              ${cols.map(col => `<td>${config.graceActions[type].includes(col) ? "✓" : "—"}</td>`).join("")}
            </tr>
          `).join("")}
        `).join("")}
      </tbody>
    </table>
  `;
}

export function initCutoffClock() {
  const timeEl = document.getElementById("cutoffCurrentTime");
  const dateInput = document.getElementById("cutoffDeliveryDate");

  if (!timeEl || !dateInput) return;

  function updateTime() {
    timeEl.textContent = formatEasternTime();
  }

  function updateAll() {
    renderBrandCards();
    renderDeliveryScheduleTable();
    renderCutoffRulesTable();
    renderGracePeriodTable();
  }

  dateInput.value = new Date().toISOString().slice(0, 10);
  updateTime();
  updateAll();

  setInterval(updateTime, 1000);
  dateInput.addEventListener("change", updateAll);
}