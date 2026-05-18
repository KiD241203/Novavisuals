// ══════════════════════════════════════════
//  DATA
// ══════════════════════════════════════════
const CAT_META = {
  wedding: { label: "Wedding", icon: "💍" },
  "pre-wedding": { label: "Pre-Wedding", icon: "🌸" },
  save_tha_date: { label: "Save the Date", icon: "📅" },
  birthday: { label: "Birthday", icon: "🎂" },
  events: { label: "Events", icon: "🎉" },
};

const STATUS_META = {
  pending: {
    label: "Pending",
    cls: "s-pending",
    color: "#fbbf24",
    dot: "#fbbf24",
  },
  confirmed: {
    label: "Confirmed",
    cls: "s-confirmed",
    color: "#4ade80",
    dot: "#4ade80",
  },
  completed: {
    label: "Completed",
    cls: "s-completed",
    color: "#60a5fa",
    dot: "#60a5fa",
  },
  cancelled: {
    label: "Rejected",
    cls: "s-cancelled",
    color: "#f87171",
    dot: "#f87171",
  },
  editinginprogress: {
    label: "Editing in Progress",
    cls: "s-rescheduled",
    color: "#a78bfa",
    dot: "#a78bfa",
  },
  sessioncompleted: {
    label: "Session completed",
    cls: "s-sessionCompleted",
    color: "#53eff5",
    dot: "#53eff5",
  },
  customercancelled: {
  label: 'Customer Cancelled',
  cls:'customer-cancelled',
  dot: "#ff7b94",
  color: '#ff7b94',
},
};

let customers = [];
let bookings = [];
let works = [];

let nextWorkId = 9,
  nextCustId = 9,
  nextBookId = 11;

// ══════════════════════════════════════════
//  NAV / TAB
// ══════════════════════════════════════════
function switchTab(tab) {
  document
    .querySelectorAll(".page")
    .forEach((p) => p.classList.remove("active"));
  document.getElementById("page-" + tab).classList.add("active");
  document.querySelectorAll(".sb-link[data-tab]").forEach((l) => {
    l.classList.toggle("active", l.dataset.tab === tab);
  });
  if (tab === "dashboard") renderDashboard();
  if (tab === "bookings") renderBookings();
  if (tab === "customers") renderCustomers();
  if (tab === "works") {
    renderWorksStats();
    renderWorks();
  }
}

// ══════════════════════════════════════════
//  HELPERS
// ══════════════════════════════════════════
function fmtDate(d) {
  return new Date(d).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}
function showToast(msg) {
  const t = document.getElementById("toast");
  document.getElementById("toastMsg").textContent = msg;
  t.classList.add("show");
  setTimeout(() => t.classList.remove("show"), 2800);
}
function updateChar(inputId, counterId, max) {
  const len = document.getElementById(inputId).value.length;
  const el = document.getElementById(counterId);
  el.textContent = `${len} / ${max}`;
  el.className =
    "char-counter" + (len > max ? " over" : len > max * 0.85 ? " warn" : "");
}
function initDate() {
  const d = new Date().toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
  ["todayDate", "todayDate2"].forEach((id) => {
    const el = document.getElementById(id);
    if (el) el.textContent = d;
  });
}

// ══════════════════════════════════════════
//  DASHBOARD
// ══════════════════════════════════════════
function renderDashboard() {
  document.getElementById("dStatBookings").textContent = bookings.length;
  document.getElementById("dStatCustomers").textContent = customers.length;
  document.getElementById("dStatWorks").textContent = works.length;
  document.getElementById("dStatConfirmed").textContent = bookings.filter(
    (b) => b.status === "confirmed",
  ).length;
  document.getElementById("dStatBookingsPending").textContent =
    bookings.filter((b) => b.status === "pending").length + " pending";

  // Recent bookings
  const rb = document.getElementById("dashRecentBookings");
  rb.innerHTML = bookings
    .slice(0, 5)
    .map((b) => {
      const sm = STATUS_META[b.status.toLowerCase()] || STATUS_META.pending;
      return `<div class="recent-item">
      <div class="ri-left">
        <div class="activity-dot" style="background:${sm.dot}"></div>
        <div>
          <div class="ri-name">${b.name}</div>
          <div class="ri-meta">${b.celebration}</div>
        </div>
      </div>
      <div class="ri-right">
        <span class="status-badge ${sm.cls}">${sm.label}</span>
        <div class="ri-date">${fmtDate(b.event_date)}</div>
      </div>
    </div>`;
    })
    .join("");

  // Recent customers
  const rc = document.getElementById("dashRecentCustomers");
  rc.innerHTML = customers
    .slice(0, 5)
    .map((c) => {
      const cat = CAT_META[c.celebration] || { icon: "", label: c.celebration };
      const userBookings = bookings.filter((b) => b.user === c.id).length;
      return `<div class="recent-item">
      <div class="ri-left">
        <div class="sb-avatar" style="width:28px;height:28px;font-size:11px">${c.username[0].toUpperCase()}</div>
        <div>
          <div class="ri-name">${c.username}</div>
          <div class="ri-meta">${c.email} ${cat.label}</div>
        </div>
      </div>
      <div class="ri-right">
        <div class="ri-date">${userBookings} booking${userBookings !== 1 ? "s" : ""}</div>
        <div class="ri-date">${fmtDate(c.date_joined)}</div>
      </div>
    </div>`;
    })
    .join("");

  // Status breakdown
  const bd = document.getElementById("dashStatusBreakdown");
  const counts = {};
  Object.keys(STATUS_META).forEach((k) => (counts[k] = 0));
  bookings.forEach((b) => counts[b.status]++);
  bd.innerHTML = Object.entries(STATUS_META)
    .map(
      ([k, v]) =>
        `<div class="stat-card">
      <div class="sc-icon"><div style="width:10px;height:10px;border-radius:50%;background:${v.color}"></div></div>
      <div class="sc-num" style="font-size:24px">${counts[k]}</div>
      <div class="sc-label">${v.label}</div>
    </div>`,
    )
    .join("");
}

// ══════════════════════════════════════════
//  BOOKINGS
// ══════════════════════════════════════════
let bFilter = "all",
  bPage = 1;
const B_PER = 8;

function filterBookings(f, el) {
  bFilter = f;
  bPage = 1;
  document
    .querySelectorAll("#page-bookings .ftab")
    .forEach((t) => t.classList.remove("active"));
  el.classList.add("active");
  renderBookings();
}

function renderBookings() {
  const q = document.getElementById("bookingSearch").value.trim().toLowerCase();
  const filtered = bookings.filter((b) => {
    if (bFilter !== "all" && b.status !== bFilter) return false;
    if (q)
      return (
        b.name.toLowerCase().includes(q) || b.celebration.toLowerCase().includes(q)
      );
    return true;
  });

  // Stats
  document.getElementById("bStatTotal").textContent = bookings.length;
  document.getElementById("bStatPending").textContent = bookings.filter(
    (b) => b.status === "pending",
  ).length;
  document.getElementById("bStatConfirmed").textContent = bookings.filter(
    (b) => b.status === "confirmed",
  ).length;
  document.getElementById("bStatCompleted").textContent = bookings.filter(
    (b) => b.status === "completed",
  ).length;

  const pages = Math.ceil(filtered.length / B_PER);
  if (bPage > pages && pages > 0) bPage = pages;
  const slice = filtered.slice((bPage - 1) * B_PER, bPage * B_PER);

  const tbody = document.getElementById("bookingsTbody");
  if (!slice.length) {
    tbody.innerHTML = `<tr><td colspan="7" style="text-align:center;padding:3rem;color:rgba(250,247,242,0.2);font-size:12px">No bookings found</td></tr>`;
  } else {
    tbody.innerHTML = slice
      .map((b, i) => {
        const sm = STATUS_META[b.status] || STATUS_META.pending;
        return `<tr>
        <td style="color:rgba(250,247,242,0.3);font-size:10.5px">#${b.id.toString().padStart(3, "0")}</td>
        <td>
          <div class="cust-row">
            <div class="cust-avatar">${b.name[0].toUpperCase()}</div>
            <div><div class="cust-name">${b.name}</div></div>
          </div>
        </td>
        <td style="font-size:12px;color:var(--muted)">${b.celebration}</td>
        <td style="font-size:11.5px;color:rgba(250,247,242,0.5)">${fmtDate(b.event_date)}</td>
        <td><span style="font-size:10px;padding:3px 9px;border-radius:3px;background:var(--al);border:1px solid var(--ab);color:var(--accent)">${b.package}</span></td>
        <td><span class="status-badge ${sm.cls}">${sm.label}</span></td>
        <td>
          <div style="display:flex;gap:5px">
            <button class="btn btn-view" style="padding:5px 10px;font-size:9px" onclick="openBookingView(${b.id})">
              <svg viewBox="0 0 24 24"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
              View
            </button>
            <button class="btn btn-edit" style="padding:5px 10px;font-size:9px" onclick="openStatusModal(${b.id})">
              <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
              Status
            </button>
            <button class="btn btn-del" style="padding:5px 10px;font-size:9px" onclick="openDel('booking',${b.id})">
              <svg viewBox="0 0 24 24"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/></svg>
            </button>
          </div>
        </td>
      </tr>`;
      })
      .join("");
  }

  // Pagination
  const pag = document.getElementById("bPagination");
  if (pages <= 1) {
    pag.style.display = "none";
    return;
  }
  pag.style.display = "flex";
  document.getElementById("bPagInfo").textContent =
    `Showing ${Math.min((bPage - 1) * B_PER + 1, filtered.length)}–${Math.min(bPage * B_PER, filtered.length)} of ${filtered.length}`;
  const btns = document.getElementById("bPagBtns");
  btns.innerHTML = "";
  const prev = document.createElement("button");
  prev.className = "pag-btn";
  prev.textContent = "← Prev";
  prev.disabled = bPage <= 1;
  prev.onclick = () => {
    bPage--;
    renderBookings();
  };
  btns.appendChild(prev);
  for (let p = 1; p <= pages; p++) {
    const b = document.createElement("button");
    b.className = "pag-btn" + (p === bPage ? " active" : "");
    b.textContent = p;
    b.onclick = ((_p) => () => {
      bPage = _p;
      renderBookings();
    })(p);
    btns.appendChild(b);
  }
  const next = document.createElement("button");
  next.className = "pag-btn";
  next.textContent = "Next →";
  next.disabled = bPage >= pages;
  next.onclick = () => {
    bPage++;
    renderBookings();
  };
  btns.appendChild(next);
}

// Booking View
function openBookingView(id) {
  const b = bookings.find((x) => x.id === id);
  if (!b) return;
  const sm = STATUS_META[b.status];
  document.getElementById("bvTitle").textContent = b.event;
  document.getElementById("bvSub").textContent =
    `Booking #${b.id.toString().padStart(3, "0")} · ${b.name}`;
  document.getElementById("bvBody").innerHTML = `
    <div class="field-row">
      <div class="field"><label>Client Name</label><div style="padding:9px 12px;background:var(--bg3);border:1px solid var(--line);border-radius:4px;font-size:12px;color:var(--cream)">${b.name}</div></div>
      <div class="field"><label>Event</label><div style="padding:9px 12px;background:var(--bg3);border:1px solid var(--line);border-radius:4px;font-size:12px;color:var(--cream)">${b.celebration}</div></div>
    </div>
    <div class="field-row">
      <div class="field"><label>Date</label><div style="padding:9px 12px;background:var(--bg3);border:1px solid var(--line);border-radius:4px;font-size:12px;color:var(--cream)">${fmtDate(b.event_date)}</div></div>
      <div class="field"><label>Package</label><div style="padding:9px 12px;background:var(--bg3);border:1px solid var(--line);border-radius:4px;font-size:12px;color:var(--cream)">${b.package}</div></div>
    </div>
    <div class="field"><label>Status</label><div style="padding:9px 12px;background:var(--bg3);border:1px solid var(--line);border-radius:4px"><span class="status-badge ${sm.cls}">${sm.label}</span></div></div>
    ${b.note ? `<div class="field"><label>Notes</label><div style="padding:9px 12px;background:var(--bg3);border:1px solid var(--line);border-radius:4px;font-size:12px;color:var(--muted);font-weight:300">${b.note}</div></div>` : ""}
  `;
  document.getElementById("bvStatusBtn").onclick = () => {
    closeBookingView();
    openStatusModal(id);
  };
  document.getElementById("bookingViewOverlay").classList.add("show");
}
function closeBookingView() {
  document.getElementById("bookingViewOverlay").classList.remove("show");
}

// Status Change
let statusTargetId = null,
  selectedNewStatus = null;
function openStatusModal(id) {
  statusTargetId = id;
  const b = bookings.find((x) => x.id === id);
  if (!b) return;
  document.getElementById("statusModalSub").textContent =
    `Booking: ${b.event} · ${b.name}`;
  selectedNewStatus = b.status;
  const opts = document.getElementById("statusOptions");
  opts.innerHTML = Object.entries(STATUS_META)
    .map(
      ([k, v]) =>
        `<div class="status-option ${k === b.status ? "selected" : ""}" onclick="selectStatus('${k}',this)">
      <div class="so-dot" style="background:${v.color}"></div>
      <span>${v.label}</span>
      ${k === b.status ? '<span style="margin-left:auto;font-size:9px;color:rgba(250,247,242,0.3)">Current</span>' : ""}
    </div>`,
    )
    .join("");
  document.getElementById("statusOverlay").classList.add("show");
}
function selectStatus(status, el) {
  selectedNewStatus = status;
  document
    .querySelectorAll(".status-option")
    .forEach((o) => o.classList.remove("selected"));
  el.classList.add("selected");
}

function getCookie(name) {
  let cookieValue = null;

  if (document.cookie && document.cookie !== "") {
    const cookies = document.cookie.split(";");

    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();

      if (cookie.substring(0, name.length + 1) === name + "=") {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));

        break;
      }
    }
  }

  return cookieValue;
}
console.log(getCookie("csrftoken"));

function applyStatus() {
  if (!statusTargetId || !selectedNewStatus) return;

  const b = bookings.find((x) => x.id === statusTargetId);

  fetch(`/admin_app/api/status-update/${statusTargetId}/`, {
    method: "PATCH",

    headers: {
      "Content-Type": "application/json",
      "X-CSRFToken": getCookie("csrftoken"),
    },

    body: JSON.stringify({
      status: selectedNewStatus,
    }),
  })
    .then((response) => response.json())

    .then((data) => {
      if (b) {
        b.status = selectedNewStatus;
      }

      showToast(`Booking updated to "${STATUS_META[selectedNewStatus].label}"`);

      renderBookings();

      renderDashboard();

      updateSideBadges();

      closeStatusModal();
    })

    .catch((error) => {
      console.log(error);
    });
}
function closeStatusModal() {
  document.getElementById("statusOverlay").classList.remove("show");
  statusTargetId = null;
  selectedNewStatus = null;
}

// ══════════════════════════════════════════
//  CUSTOMERS
// ══════════════════════════════════════════
function renderCustomers() {
  const q = document
    .getElementById("customerSearch")
    .value.trim()
    .toLowerCase();

  const filtered = customers.filter((c) => {
    const userBookings = bookings.filter(
      (b) => Number(b.user) === Number(c.id),
    );

    const firstBooking = userBookings[0];

    if (q) {
      return (
        c.username.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q) ||
        (firstBooking?.phone || "").includes(q)
      );
    }

    return true;
  });

  // Stats

  document.getElementById("cStatTotal").textContent = customers.length;

  document.getElementById("cStatWedding").textContent = bookings.filter(
    (b) => b.celebration === "wedding",
  ).length;

  document.getElementById("cStatRepeat").textContent = customers.filter((c) => {
    const userBookings = bookings.filter(
      (b) => Number(b.user) === Number(c.id),
    );

    return userBookings.length >= 2;
  }).length;

  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

  document.getElementById("cStatNew").textContent = customers.filter(
    (c) => new Date(c.date_joined) >= thirtyDaysAgo,
  ).length;

  // Table

  const tbody = document.getElementById("customersTbody");

  if (!filtered.length) {
    tbody.innerHTML = `
    
    <tr>
      <td colspan="8"
        style="
          text-align:center;
          padding:3rem;
          color:rgba(250,247,242,0.2);
          font-size:12px
        "
      >
        No customers found
      </td>
    </tr>`;

    return;
  }

  tbody.innerHTML = filtered

    .map((c, i) => {
      const userBookings = bookings.filter(
        (b) => Number(b.user) === Number(c.id),
      );

      const firstBooking = userBookings[0];

      const cat = CAT_META[firstBooking?.celebration] || {
        icon: "",
        label: "-",
      };

      return `

      <tr>

        <td style="
          color:rgba(250,247,242,0.3);
          font-size:10.5px
        ">
          #${c.id.toString().padStart(3, "0")}
        </td>

        <td>

          <div class="cust-row">

            <div class="cust-avatar">
              ${c.username[0].toUpperCase()}
            </div>

            <div>

              <div class="cust-name">
                ${c.username.charAt(0).toUpperCase() + c.username.slice(1)}
              </div>

            </div>

          </div>

        </td>

        <td style="
          font-size:11.5px;
          color:var(--muted)
        ">
          ${c.email}
        </td>

        <td style="
          font-size:11.5px;
          color:var(--muted)
        ">
          ${firstBooking?.phone || "-"}
        </td>

        <td style="text-align:center">

          <span style="
            font-family:'Playfair Display',serif;
            font-size:16px;
            color:var(--accent)
          ">
            ${userBookings.length}
          </span>

        </td>

        <td>

          <span style="font-size:10px">
            ${cat.icon} ${cat.label}
          </span>

        </td>

        <td style="
          font-size:11px;
          color:rgba(250,247,242,0.35)
        ">
          ${fmtDate(c.date_joined)}
        </td>

        <td>

          <div style="display:flex;gap:5px">

            <button
              class="btn btn-view"
              style="padding:5px 10px;font-size:9px"
              onclick="openCustomerView(${c.id})"
            >

              <svg viewBox="0 0 24 24">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                <circle cx="12" cy="12" r="3"/>
              </svg>

              View

            </button>

            <button
              class="btn btn-del"
              style="padding:5px 10px;font-size:9px"
              onclick="openDel('customer',${c.id})"
            >

              <svg viewBox="0 0 24 24">
                <polyline points="3 6 5 6 21 6"/>
                <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
              </svg>

            </button>

          </div>

        </td>

      </tr>`;
    })

    .join("");
}
function openCustomerView(id) {
  const c = customers.find((x) => Number(x.id) === Number(id));

  if (!c) return;

  const cBookings = bookings.filter((b) => Number(b.user) === Number(id));

  const firstBooking = cBookings[0];

  const cat = CAT_META[firstBooking?.celebration] || {
    icon: "",
    label: "-",
  };

  document.getElementById("cvTitle").textContent =
    c.username.charAt(0).toUpperCase() + c.username.slice(1);

  document.getElementById("cvSub").textContent =
    `Customer #${c.id.toString().padStart(3, "0")}`;

  document.getElementById("cvBody").innerHTML = `

    <div class="field-row">

      <div class="field">

        <label>Email</label>

        <div style="
          padding:9px 12px;
          background:var(--bg3);
          border:1px solid var(--line);
          border-radius:4px;
          font-size:12px;
          color:var(--cream)
        ">

          ${c.email}

        </div>

      </div>

      <div class="field">

        <label>Phone</label>

        <div style="
          padding:9px 12px;
          background:var(--bg3);
          border:1px solid var(--line);
          border-radius:4px;
          font-size:12px;
          color:var(--cream)
        ">

          ${firstBooking?.phone || "-"}

        </div>

      </div>

    </div>

    <div class="field-row">

      <div class="field">

        <label>Category</label>

        <div style="
          padding:9px 12px;
          background:var(--bg3);
          border:1px solid var(--line);
          border-radius:4px;
          font-size:12px;
          color:var(--cream)
        ">

          ${cat.icon} ${cat.label}

        </div>

      </div>

      <div class="field">

        <label>Joined</label>

        <div style="
          padding:9px 12px;
          background:var(--bg3);
          border:1px solid var(--line);
          border-radius:4px;
          font-size:12px;
          color:var(--cream)
        ">

          ${fmtDate(c.date_joined)}

        </div>

      </div>

    </div>

    <div class="field">

      <label>
        Bookings (${cBookings.length})
      </label>

      <div style="
        display:flex;
        flex-direction:column;
        gap:5px;
        margin-top:2px
      ">

        ${
          cBookings.length
            ? cBookings

                .map((b) => {
                  const sm =
                    STATUS_META[b.status.toLowerCase()] || STATUS_META.pending;

                  return `

                  <div style="
                    display:flex;
                    justify-content:space-between;
                    align-items:center;
                    padding:8px 12px;
                    background:var(--bg3);
                    border:1px solid var(--line);
                    border-radius:4px
                  ">

                    <span style="
                      font-size:12px;
                      color:var(--cream)
                    ">

                      ${b.celebration}

                    </span>

                    <div style="
                      display:flex;
                      align-items:center;
                      gap:8px
                    ">

                      <span style="
                        font-size:10.5px;
                        color:rgba(250,247,242,0.35)
                      ">

                        ${fmtDate(b.event_date)}

                      </span>

                      <span class="status-badge ${sm.cls}">

                        ${sm.label}

                      </span>

                    </div>

                  </div>`;
                })

                .join("")
            : `

            <div style="
              padding:10px;
              font-size:11px;
              color:rgba(250,247,242,0.25);
              font-weight:300
            ">

              No bookings yet

            </div>`
        }

      </div>

    </div>

  `;

  document.getElementById("cvDelBtn").onclick = () => {
    closeCustomerView();

    openDel("customer", id);
  };

  document.getElementById("customerViewOverlay").classList.add("show");
}
function closeCustomerView() {
  document.getElementById("customerViewOverlay").classList.remove("show");
}

// ══════════════════════════════════════════
//  WORKS
// ══════════════════════════════════════════
let activeCat = "all",
  activeType = null,
  workSearch = "",
  workPage = 1;
const W_PER = 6;
let workEditingId = null,
  pendingFile = null;

function filterWorks(cat, el) {
  activeCat = cat;
  workPage = 1;
  document
    .querySelectorAll("#page-works .ftab")
    .forEach((t) => t.classList.remove("active"));
  el.classList.add("active");
  renderWorks();
}
function toggleTypeFilter(type) {
  if (activeType === type) {
    activeType = null;
    document.getElementById("chipImage").classList.remove("active-img");
    document.getElementById("chipVideo").classList.remove("active-vid");
  } else {
    activeType = type;
    document.getElementById("chipImage").classList.remove("active-img");
    document.getElementById("chipVideo").classList.remove("active-vid");
    document
      .getElementById(type === "image" ? "chipImage" : "chipVideo")
      .classList.add(type === "image" ? "active-img" : "active-vid");
  }
  workPage = 1;
  renderWorks();
}

function renderWorksStats() {
  document.getElementById("statTotal").textContent = works.length;
  document.getElementById("statImages").textContent = works.filter(
    (w) => w.work_type === "image",
  ).length;
  document.getElementById("statVideos").textContent = works.filter(
    (w) => w.work_type === "video",
  ).length;
  document.getElementById("statWeddings").textContent = works.filter(
    (w) => w.category === "wedding",
  ).length;
  document.getElementById("sbWorksBadge").textContent = works.length;
}

function getFilteredWorks() {
  return works.filter((w) => {
    if (activeCat !== "all" && w.category !== activeCat) return false;
    if (activeType && w.work_type !== activeType) return false;
    if (workSearch) {
      const q = workSearch.toLowerCase();
      return (
        w.title.toLowerCase().includes(q) ||
        (w.description || "").toLowerCase().includes(q)
      );
    }
    return true;
  });
}

function renderWorks() {
  renderWorksStats();
  const filtered = getFilteredWorks();
  const pages = Math.ceil(filtered.length / W_PER);
  if (workPage > pages && pages > 0) workPage = pages;
  const slice = filtered.slice((workPage - 1) * W_PER, workPage * W_PER);
  const grid = document.getElementById("worksGrid");
  grid.innerHTML = "";

  if (!slice.length) {
    grid.innerHTML = `<div class="empty-state">
      <svg viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
      <p>${workSearch ? "No works match your search." : "No works in this category yet."}</p>
    </div>`;
    document.getElementById("wPagination").style.display = "none";
    return;
  }

  slice.forEach((w, i) => {
    const card = document.createElement("div");
    card.className = "work-card";
    card.style.animationDelay = i * 0.055 + "s";
    const cat = CAT_META[w.category] || { icon: "", label: w.category };
    const date = fmtDate(w.created_at);
    const fn = w.file ? String(w.file).split("/").pop() : "—";
    card.innerHTML = `
      <div class="work-thumb">
        ${
          w.work_type === "image"
            ? `

      <img 
        src="${w.file}"
        alt="${w.title}"
        class="work-image"
      >

    `
            : `

      <video class="work-image" controls>

        <source src="${w.file}">

      </video>

    `
        }
        <span class="cat-badge">${cat.icon}  ${cat.label}</span>
        <span class="type-badge ${w.work_type}">${w.work_type}</span>
      </div>
      <div class="work-body">
        <div class="work-title">${w.title}</div>
        ${
          w.description
            ? `<div class="work-desc">${w.description}</div>`
            : `<div class="work-desc" style="color:rgba(250,247,242,0.15);font-style:italic">No description</div>`
        }
        <div class="work-meta-row">
          <span class="work-date">${date}</span>
          <span class="work-dot"></span>
          <span class="work-file">${fn}</span>
        </div>
      </div>
      <div class="work-foot">
        <button class="btn btn-view" onclick="openWorkView(${w.id})">
          <svg viewBox="0 0 24 24"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
          View
        </button>
        <button class="btn btn-edit" onclick="openWorkForm(${w.id})">
          <svg viewBox="0 0 24 24"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
          Edit
        </button>
        <button class="btn btn-del" onclick="openDel('work',${w.id})">
          <svg viewBox="0 0 24 24"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>
          Delete
        </button>
      </div>`;
    grid.appendChild(card);
  });

  // Pagination
  const pag = document.getElementById("wPagination");
  if (pages <= 1) {
    pag.style.display = "none";
    return;
  }
  pag.style.display = "flex";
  document.getElementById("wPagInfo").textContent =
    `Showing ${Math.min((workPage - 1) * W_PER + 1, filtered.length)}–${Math.min(workPage * W_PER, filtered.length)} of ${filtered.length}`;
  const btns = document.getElementById("wPagBtns");
  btns.innerHTML = "";
  const prev = document.createElement("button");
  prev.className = "pag-btn";
  prev.textContent = "← Prev";
  prev.disabled = workPage <= 1;
  prev.onclick = () => {
    workPage--;
    renderWorks();
  };
  btns.appendChild(prev);
  for (let p = 1; p <= pages; p++) {
    const b = document.createElement("button");
    b.className = "pag-btn" + (p === workPage ? " active" : "");
    b.textContent = p;
    b.onclick = ((_p) => () => {
      workPage = _p;
      renderWorks();
    })(p);
    btns.appendChild(b);
  }
  const next = document.createElement("button");
  next.className = "pag-btn";
  next.textContent = "Next →";
  next.disabled = workPage >= pages;
  next.onclick = () => {
    workPage++;
    renderWorks();
  };
  btns.appendChild(next);
}

function openWorkForm(id) {
  workEditingId = id || null;
  pendingFile = null;
  clearFile();
  const isEdit = !!id;
  document.getElementById("wFormTitle").textContent = isEdit
    ? "Edit Work"
    : "Add New Work";
  document.getElementById("wFormSub").textContent = isEdit
    ? "Update details for this portfolio item"
    : "Fill in the details to publish a new portfolio item";
  document.getElementById("wSaveBtnTxt").textContent = isEdit
    ? "Save Changes"
    : "Save Work";
  document.getElementById("editFileNote").style.display = isEdit
    ? "block"
    : "none";
  if (isEdit) {
    const w = works.find((x) => x.id === id);
    if (!w) return;
    document.getElementById("fTitle").value = w.title;
    document.getElementById("fCategory").value = w.category;
    document.getElementById("fType").value = w.work_type;
    document.getElementById("fDesc").value = w.description || "";
  } else {
    document.getElementById("fTitle").value = "";
    document.getElementById("fCategory").value = "wedding";
    document.getElementById("fType").value = "image";
    document.getElementById("fDesc").value = "";
  }
  updateChar("fTitle", "titleCounter", 50);
  updateChar("fDesc", "descCounter", 300);
  document.getElementById("workFormOverlay").classList.add("show");
  setTimeout(() => document.getElementById("fTitle").focus(), 280);
}
function closeWorkForm() {
  document.getElementById("workFormOverlay").classList.remove("show");
  workEditingId = null;
  pendingFile = null;
}

function saveWork() {
  const title = document.getElementById("fTitle").value.trim();
  if (!title) {
    showToast("⚠ Title is required");
    return;
  }
  const category = document.getElementById("fCategory").value,
    work_type = document.getElementById("fType").value,
    desc = document.getElementById("fDesc").value.trim();
  if (!workEditingId && !pendingFile) {
    showToast("⚠ Please select a file");
    return;
  }
  if (workEditingId) {
   const formData = new FormData()

formData.append('title', title)
formData.append('category', category)
formData.append('work_type', work_type)
formData.append('description', desc)

if (pendingFile) {

  formData.append(
    'file',
    pendingFile
  )

}

fetch(`/admin_app/api/edit-work/${workEditingId}/`, {

  method: 'PUT',

  headers: {
    'X-CSRFToken': getCookie('csrftoken')
  },

  body: formData

})

.then(response => response.json())

.then(data => {

  const updatedWork = data.data

  const index = works.findIndex(
    (w) => w.id === updatedWork.id
  )

  if(index !== -1){

    works[index] = updatedWork

  }

  renderWorks()

  renderDashboard()

  closeWorkForm()

  showToast("Work updated successfully")

})

.catch(error => {

  console.log(error)

})
    showToast(`"${title}" updated`);
  }  else {

  const formData = new FormData()

  formData.append('title', title)

  formData.append('category', category)

  formData.append('work_type', work_type)

  formData.append('description', desc)

  formData.append('file', pendingFile)

  fetch('/admin_app/api/add-work/', {

    method: 'POST',

    headers: {
      'X-CSRFToken': getCookie('csrftoken')
    },

    body: formData

  })

  .then(response => response.json())

  .then(data => {

    works.unshift(data.data)

    renderWorks()

    renderDashboard()

    updateSideBadges()

    closeWorkForm()

    showToast("Work added successfully")

  })

  .catch(error => {

    console.log(error)

  })

}
  // closeWorkForm();
  // workPage = 1;
  // renderWorks();
  // updateSideBadges();
 }

function handleFileSelect(input) {
  if (input.files[0]) setFile(input.files[0]);
}
function handleDrop(e) {
  e.preventDefault();
  document.getElementById("fileZone").classList.remove("drag-over");
  const f = e.dataTransfer.files[0];
  if (f) setFile(f);
}
function setFile(f) {
  pendingFile = f;
  document.getElementById("fileName").textContent = f.name;
  document.getElementById("filePreview").style.display = "flex";
}
function clearFile() {
  pendingFile = null;
  document.getElementById("fFile").value = "";
  document.getElementById("fileName").textContent = "";
  document.getElementById("filePreview").style.display = "none";
}

function openWorkView(id) {
  const w = works.find((x) => x.id === id);
  if (!w) return;
  const cat = CAT_META[w.category] || { icon: "", label: w.category };
  document.getElementById("vTitle").textContent = w.title;
  document.getElementById("vSub").textContent =
    `${cat.icon} ${cat.label} · ${w.work_type === "image" ? "📷 Image" : "🎬 Video"} · Added ${fmtDate(w.created_at)}`;
  document.getElementById("vPreview").innerHTML =
    `<div class="wmodal-preview-placeholder">
    ${
      w.work_type === "video"
        ? `<svg viewBox="0 0 24 24"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2"/></svg>`
        : `<svg viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>`
    }
    <span style="font-size:10px;letter-spacing:0.18em;text-transform:uppercase;color:rgba(250,247,242,0.2)">${w.file || "No file"}</span>
  </div>`;
  document.getElementById("vBody").innerHTML = `
    <div class="modal-row"><span class="modal-k">Category</span><span class="modal-v">${cat.icon} ${cat.label}</span></div>
    <div class="modal-row"><span class="modal-k">Type</span><span class="modal-v">${w.work_type === "image" ? "📷 Image" : "🎬 Video"}</span></div>
    <div class="modal-row"><span class="modal-k">File</span><span class="modal-v" style="font-size:11px;color:var(--muted)">${w.file || "—"}</span></div>
    <div class="modal-row"><span class="modal-k">Added</span><span class="modal-v">${fmtDate(w.created_at)}</span></div>
    ${w.description ? `<div class="modal-row" style="flex-direction:column;align-items:flex-start;gap:5px"><span class="modal-k">Description</span><span class="modal-v" style="font-size:12px;font-weight:300;color:var(--muted);line-height:1.6">${w.description}</span></div>` : ""}
  `;
  document.getElementById("vEditBtn").onclick = () => {
    closeWorkView();
    openWorkForm(id);
  };
  document.getElementById("vDelBtn").onclick = () => {
    closeWorkView();
    openDel("work", id);
  };
  document.getElementById("workViewOverlay").classList.add("show");
}
function closeWorkView() {
  document.getElementById("workViewOverlay").classList.remove("show");
}

// ══════════════════════════════════════════
//  DELETE
// ══════════════════════════════════════════
let delTarget = null; // {type, id}
function openDel(type, id) {
  delTarget = { type, id };
  let name = "—";
  if (type === "work") {
    const w = works.find((x) => x.id === id);
    name = w?.title || "This work";
  }
  if (type === "booking") {
    const b = bookings.find((x) => x.id === id);
    name = b ? `${b.event} (${b.name})` : "This booking";
  }
  if (type === "customer") {
    const c = customers.find((x) => x.id === id);
    name = c?.name || "This customer";
  }
  document.getElementById("delMsg").innerHTML =
    `<strong>"${name}"</strong> will be permanently deleted. This action cannot be undone.`;
  document.getElementById("delConfirmBtn").onclick = confirmDelete;
  document.getElementById("delOverlay").classList.add("show");
}
function closeDel() {
  document.getElementById("delOverlay").classList.remove("show");
  delTarget = null;
}

function confirmDelete() {

  if (!delTarget) return;

  const { type, id } = delTarget;

  // WORK DELETE

  if (type === "work") {

    fetch(`/admin_app/api/delete-work/${id}/`, {

      method: 'DELETE',

      headers: {
        'X-CSRFToken': getCookie('csrftoken')
      }

    })

    .then(response => response.json())

    .then(data => {

      works = works.filter(
        (w) => w.id !== id
      )

      renderWorks()

      renderDashboard()

      updateSideBadges()

      closeDel()

      showToast("Work deleted successfully")

    })

    .catch(error => {

      console.log(error)

    })

  }

  // BOOKING DELETE

  if (type === "booking") {

    fetch(`/admin_app/api/delete-booking/${id}/`, {

      method: 'DELETE',

      headers: {
        'X-CSRFToken': getCookie('csrftoken')
      }

    })

    .then(response => response.json())

    .then(data => {

      bookings = bookings.filter(
        (b) => b.id !== id
      )

      renderBookings()

      renderDashboard()

      updateSideBadges()

      closeDel()

      showToast("Booking deleted successfully")

    })

    .catch(error => {

      console.log(error)

    })

  }

  // CUSTOMER DELETE

  if (type === "customer") {

    fetch(`/admin_app/api/delete-customer/${id}/`, {

      method: 'DELETE',

      headers: {
        'X-CSRFToken': getCookie('csrftoken')
      }

    })

    .then(response => response.json())

    .then(data => {

      customers = customers.filter(
        (c) => c.id !== id
      )

      renderCustomers()

      renderDashboard()

      updateSideBadges()

      closeDel()

      showToast("Customer deleted successfully")

    })

    .catch(error => {

      console.log(error)

    })

  }

}

// ══════════════════════════════════════════
//  BADGES & BACKDROP
// ══════════════════════════════════════════
function updateSideBadges() {
  document.getElementById("sbBookingsBadge").textContent = bookings.filter(
    (b) => b.status === "pending",
  ).length;
  document.getElementById("sbCustomersBadge").textContent = customers.length;
  document.getElementById("sbWorksBadge").textContent = works.length;
}

[
  "workFormOverlay",
  "workViewOverlay",
  "bookingViewOverlay",
  "statusOverlay",
  "customerViewOverlay",
  "delOverlay",
].forEach((id) => {
  document.getElementById(id).addEventListener("click", function (e) {
    if (e.target === this) {
      if (id === "workFormOverlay") closeWorkForm();
      if (id === "workViewOverlay") closeWorkView();
      if (id === "bookingViewOverlay") closeBookingView();
      if (id === "statusOverlay") closeStatusModal();
      if (id === "customerViewOverlay") closeCustomerView();
      if (id === "delOverlay") closeDel();
    }
  });
});

//  fetching bookings and customers
document.addEventListener("DOMContentLoaded", () => {
  Promise.all([
    fetch("/admin_app/api/bookings/").then((response) => response.json()),

    fetch("/admin_app/api/customers/").then((response) => response.json()),

    fetch("/admin_app/api/works/").then((response) => response.json()),
  ])

    .then(([bookingData, customerData, workData]) => {
      bookings = bookingData;
      customers = customerData;
      works = workData;

      renderBookings();
      renderDashboard();
      updateSideBadges();
      initDate()

    })

    .catch((error) => {
      console.log(error);
    });
});



function openNovaLogoutModal(){

    document
      .getElementById("novaLogoutOverlay")
      .classList.add("active");

}

function closeNovaLogoutModal(){

    document
      .getElementById("novaLogoutOverlay")
      .classList.remove("active");

}