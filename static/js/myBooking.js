

let bookings = [];

function formatDate(dateStr){
  const d = new Date(dateStr);
  return{
    day: d.getDate(),
    month: d.toLocaleString('default',{month:'short'}),
    year: d.getFullYear()
  }
}



const catLabels = {wedding:'Wedding',prewedding:'Pre-Wedding',birthday:'Birthday',savedate:'Save the Date',event:'Events'};
const catColors = {wedding:'wedding',prewedding:'prewedding',birthday:'birthday',savedate:'savedate',event:'event'};
const statusMeta = {

  pending: {
    label: 'Pending',
    color: '#fbbf24',
    icon: '⏳'
  },

  confirmed: {
    label: 'Confirmed',
    color: '#4ade80',
    icon: '✅'
  },

  completed: {
    label: 'Completed',
    color: '#60a5fa',
    icon: '🎉'
  },

  cancelled: {
    label: 'Rejected',
    color: '#f87171',
    icon: '❌'
  },

  sessioncompleted: {
    label: 'Shot Done',
    color: '#53eff5',
    icon: '📸'
  },

  editinginprogress: {
    label: 'In Edit',
    color: '#a78bfa',
    icon: '🎞️'
  },
  customercancelled: {
  label: ' Cancelled',
  color: '#ef4444',
  icon: '🚫'
},

};
const tlSteps = [
  {name:'Booking Received',desc:'Your request has been submitted'},
  {name:'Confirmed',desc:'Team has confirmed your slot'},
  {name:'Session Complete',desc:'Photos captured successfully'},
  {name:'Editing in Progress',desc:'Post-processing underway'},
  {name:'Gallery Delivered',desc:'Your photos are ready!'},
];

let activeFilter = 'all';
let gridMode = true;
let openBookingId = null;

function buildGridCard(b){
  const actions = b.status === 'confirmed' || b.status === 'pending'
    ? `<button class="bk-act danger" title="Cancel" onclick="event.stopPropagation();openDrawer('${b.id}')"><svg viewBox="0 0 24 24"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/></svg></button>`
    : b.status === 'completed'
    ? `<button class="bk-act" title="Gallery" onclick="event.stopPropagation()"><svg viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg></button>`
    : '';

  return `
  <div class="bk-card" onclick="openDrawer('${b.id}')">
    <div class="bk-card-visual">
      <div class="bk-visual-bg ${catColors[b.category]}"></div>
      <div class="bk-visual-pattern"></div>
      <div class="bk-visual-content">
        <div class="bk-cat-pill">${catLabels[b.category]}</div>
        <div class="bk-visual-bottom">
          <div class="bk-date-big">${b.date.day}</div>
          <div 
  class="bk-status-pill ${b.status}"
  style="background:${statusMeta[b.status]?.color}20;
         color:${statusMeta[b.status]?.color};
         border:1px solid ${statusMeta[b.status]?.color}40"
>
  ${statusMeta[b.status]?.icon}
  ${statusMeta[b.status]?.label}
</div>
        </div>
      </div>
    </div>
    <div class="bk-card-body">
      <div class="bk-card-name">${b.name}</div>
      <div class="bk-card-pkg">${b.package}</div>
      <div class="bk-card-meta">
        <div class="bk-meta-tag">
          <svg viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
          ${b.date.day} ${b.date.month} ${b.date.year}
        </div>
        <div class="bk-meta-tag">
          <svg viewBox="0 0 24 24"><path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
          ${b.location.split(',')[0]}
        </div>
      </div>
    </div>
    <div class="bk-card-foot">
      <div class="bk-price">${b.price_of_package}</div>
      <div class="bk-foot-actions">
        <button class="bk-act" title="Details" onclick="event.stopPropagation();openDrawer('${b.id}')"><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg></button>
        ${actions}
      </div>
    </div>
  </div>`;
}

function render(){
  const q = document.getElementById('searchInput').value.toLowerCase();
  const grid = document.getElementById('bookingGrid');
  const empty = document.getElementById('emptyState');

  const filtered = bookings.filter(b => {
    const mf = activeFilter === 'all' || b.status === activeFilter;
    const ms = !q || b.name.toLowerCase().includes(q) || b.id.toLowerCase().includes(q) || catLabels[b.category].toLowerCase().includes(q);
    return mf && ms;
  });

  grid.innerHTML = filtered.map(buildGridCard).join('');
  empty.classList.toggle('show', filtered.length === 0);
  grid.style.display = filtered.length === 0 ? 'none' : '';
}

function openDrawer(id){
  const b = bookings.find(x => x.id === id);
  if(!b) return;
  openBookingId = id;

  const statusStepMap = {
  pending: 0,
  confirmed: 1,
  sessioncompleted: 2,
  editinginprogress: 3,
  completed: 4,
};

  b.timelineStep = statusStepMap[b.status] || 0;

  document.getElementById('dhCat').textContent = catLabels[b.category];
  document.getElementById('dhTitle').textContent = b.name;

  const tl = tlSteps.map((step, i) => {

  let cls = '';
  let icon = '';

  if (b.status === 'completed') {
    cls = 'done';
    icon = `<svg viewBox="0 0 10 8">
              <polyline points="1,4 3.5,6.5 9,1"/>
            </svg>`;
  } else {
    cls = i < b.timelineStep
      ? 'done'
      : i === b.timelineStep
      ? 'active'
      : '';

    icon = i < b.timelineStep
      ? `<svg viewBox="0 0 10 8">
           <polyline points="1,4 3.5,6.5 9,1"/>
         </svg>`
      : i === b.timelineStep
      ? `<svg viewBox="0 0 8 8">
           <circle cx="4" cy="4" r="2" fill="currentColor"/>
         </svg>`
      : '';
  }

  return `
    <div class="tl-row ${cls}">
      <div class="tl-node">${icon}</div>
      <div class="tl-text">
        <div class="tl-step-name">${step.name}</div>
        <div class="tl-step-desc">${step.desc}</div>
      </div>
    </div>
  `;
}).join('');
  const cancelBtn = (b.status==='confirmed'||b.status==='pending')
    ? `<button class="dr-btn danger" onclick="cancelBooking('${b.id}')"><svg viewBox="0 0 24 24"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/></svg>Cancel Booking</button>` : '';
  const galleryBtn = b.status==='completed'
    ? `<button class="dr-btn primary"><svg viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>View Gallery</button>` : '';

  document.getElementById('drawerBody').innerHTML = `
    <div>
      <div class="dr-section-label">Booking Summary</div>
      <div class="dr-hero">
        <div class="dr-hero-left">
<div 
  class="bk-status-pill ${b.status}" 
  style="
    display:inline-block;
    background:${statusMeta[b.status]?.color}20;
    color:${statusMeta[b.status]?.color};
    border:1px solid ${statusMeta[b.status]?.color}40
  "
>
  ${statusMeta[b.status]?.icon}
  ${statusMeta[b.status]?.label}
</div>          <div class="dr-pkg-name">${b.package}</div>
          <div class="dr-ref">${b.id}</div>
        </div>
        <div>
          <div class="dr-price">${b.price_of_package}</div>
          
          <div class="dr-price-note">Est. range</div>
        </div>
      </div>
    </div>
    <div>
      <div class="dr-section-label">Session Details</div>
      <div class="dr-grid">
        <div class="dr-cell"><div class="dr-cell-label">Date</div><div class="dr-cell-value">${b.date.day} ${b.date.month} ${b.date.year}</div></div>
        <div class="dr-cell"><div class="dr-cell-label">Duration</div><div class="dr-cell-value">${b.duration}</div></div>
        <div class="dr-cell"><div class="dr-cell-label">Location</div><div class="dr-cell-value">${b.location}</div></div>
        <div class="dr-cell"><div class="dr-cell-label">Photographer</div><div class="dr-cell-value">${b.photographer}</div></div>
        <div class="dr-cell" style="grid-column:span 2"><div class="dr-cell-label">Notes</div><div class="dr-cell-value">${b.notes}</div></div>
      </div>
    </div>
    <div>
      <div class="dr-section-label">Progress</div>
      <div class="dr-timeline">${tl}</div>
    </div>
    <div class="dr-actions">
      ${galleryBtn}
      <button class="dr-btn ghost"><svg viewBox="0 0 24 24"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>Message Team</button>
      ${cancelBtn}
    </div>`;
console.log(b)
  document.getElementById('drawerOverlay').classList.add('show');
  document.getElementById('drawer').classList.add('show');
}

function closeDrawer(){
  document.getElementById('drawerOverlay').classList.remove('show');
  document.getElementById('drawer').classList.remove('show');
}

function getCookie(name) {

  let cookieValue = null;

  if (document.cookie && document.cookie !== '') {

    const cookies = document.cookie.split(';');

    for (let i = 0; i < cookies.length; i++) {

      const cookie = cookies[i].trim();

      if (
        cookie.substring(0, name.length + 1)
        === (name + '=')
      ) {

        cookieValue = decodeURIComponent(
          cookie.substring(name.length + 1)
        );

        break;
      }
    }
  }

  return cookieValue;
}

async function cancelBooking(id){

  try{

    const response = await fetch(
      `/admin_app/api/status-update/${id}/`,
      {
        method: 'PATCH',

        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': getCookie('csrftoken')
        },

        body: JSON.stringify({
          status: 'customercancelled'
        })
      }
    );

    const data = await response.json();

    if(response.ok){

      const b = bookings.find(x => x.id == id);

      if(b){
        b.status = 'customercancelled';
        b.timelineStep = 0;
      }

      closeDrawer();
      render();

    }else{
      alert(data.error || 'Failed to cancel booking');
    }

  }catch(error){
    console.log(error);
  }
}

// filter tabs
document.querySelectorAll('.fp').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.fp').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    activeFilter = btn.dataset.filter;
    render();
  });
});

// search
document.getElementById('searchInput').addEventListener('input', render);

// view toggle
document.getElementById('gridBtn').addEventListener('click', () => {
  gridMode = true;
  document.getElementById('bookingGrid').classList.remove('list-mode');
  document.getElementById('gridBtn').classList.add('active');
  document.getElementById('listBtn').classList.remove('active');
});
document.getElementById('listBtn').addEventListener('click', () => {
  gridMode = false;
  document.getElementById('bookingGrid').classList.add('list-mode');
  document.getElementById('listBtn').classList.add('active');
  document.getElementById('gridBtn').classList.remove('active');
});


// fetching data ================================

fetch('/accounts/api/my-bookings/')
  .then(res => res.json())
  .then(data => {

    bookings = data.map(b => ({
      id: String(b.id),
      name: b.name,                 
      package: b.package,
      location: b.city,             
      date: formatDate(b.event_date),

      status: b.status,             
      category: b.celebration,     

      price_of_package: b.price_of_package,
      photographer: 'Prabin',
      duration: b.duration,
      phone: b.phone,
      notes: b.message,
      timelineStep: 0
    }));

    render();
  });
 





// ── MOBILE SIDEBAR TOGGLE ──
function openSidebar(){
  document.querySelector('.sidebar').classList.add('open');
  document.getElementById('sbOverlay').classList.add('show');
  document.body.style.overflow='hidden';
}
function closeSidebar(){
  document.querySelector('.sidebar').classList.remove('open');
  document.getElementById('sbOverlay').classList.remove('show');
  document.body.style.overflow='';
}
const mobBtn = document.getElementById('mobMenuBtn');
if(mobBtn) mobBtn.addEventListener('click', openSidebar);

// close sidebar when a nav link is tapped on mobile
document.querySelectorAll('.sb-link').forEach(l => {
  l.addEventListener('click', () => {
    if(window.innerWidth <= 768) closeSidebar();
  });
});