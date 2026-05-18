
const packages = {

  wedding: [
  {
    name: 'Basic',
    price: '₹20,000 – ₹30,000',
    duration: '1 Day',
    tagline: 'Ideal for intimate ceremonies & small weddings',
    inc: '1 day photography coverage · 1 professional photographer · 300 edited high-res photos · Online gallery delivery · 7-day turnaround'
  },
  {
    name: 'Standard',
    price: '₹40,000 – ₹60,000',
    duration: '2 Days',
    tagline: 'Our best-seller — perfect for full wedding days',
    inc: 'Photo + Cinematic video · 2 photographers + 1 videographer · 500 edited photos + highlight reel · 2 day coverage · Online gallery + USB delivery · 14-day turnaround',
    popular: true
  },
  {
    name: 'Premium',
    price: '₹80,000 – ₹1,50,000',
    duration: '3 Days',
    tagline: 'Complete luxury — for grand celebrations',
    inc: 'Full 3-day coverage · 3 photographers + videographer + drone · Unlimited edited photos + full film · Premium album · Drone coverage · Same-day teaser reel'
  }
],

prewedding: [
  {
    name: 'Basic Shoot',
    price: '₹10,000 – ₹20,000',
    duration: '2–3 Hours',
    tagline: 'Perfect for a quick, beautiful couple session',
    inc: '2–3 hour shoot · 1 location · 80 edited photos · Online gallery delivery'
  },
  {
    name: 'Cinematic',
    price: '₹25,000 – ₹40,000',
    duration: 'Full Day',
    tagline: 'Our most loved pre-wedding experience',
    inc: 'Full day shoot · 2 locations · 200 photos · Cinematic video · Mini album',
    popular: true
  },
  {
    name: 'Destination',
    price: '₹50,000 – ₹90,000',
    duration: '2 Days',
    tagline: 'Travel charges billed separately',
    inc: '2-day destination shoot · Multiple locations · Unlimited photos · Full cinematic film · Premium album'
  }
],

savedate: [
  {
    name: 'Announcement',
    price: '₹6,000 – ₹10,000',
    duration: '1.5 Hours',
    tagline: 'Simple and elegant',
    inc: '1.5 hour shoot · 50 edited photos · Digital delivery · Social media ready'
  },
  {
    name: 'Story',
    price: '₹12,000 – ₹20,000',
    duration: '3 Hours',
    tagline: 'Most popular save-the-date package',
    inc: '3 hour shoot · 120 photos · Outfit changes · Teaser reel',
    popular: true
  },
  {
    name: 'Cinematic',
    price: '₹22,000 – ₹35,000',
    duration: 'Full Day',
    tagline: 'Full experience',
    inc: 'Full day shoot · Unlimited photos · Cinematic film · Styled setup'
  }
],

birthday: [
  {
    name: 'Celebration',
    price: '₹5,000 – ₹10,000',
    duration: '2 Hours',
    tagline: 'Ideal for small parties',
    inc: '2 hour coverage · 100 photos · Online gallery'
  },
  {
    name: 'Party',
    price: '₹12,000 – ₹20,000',
    duration: '4 Hours',
    tagline: 'Most popular birthday package',
    inc: '4 hour coverage · 250 photos · Highlights video · Mini album',
    popular: true
  },
  {
    name: 'Grand',
    price: '₹22,000 – ₹35,000',
    duration: '6 Hours',
    tagline: 'Go all out',
    inc: '6 hour coverage · Unlimited photos · Cinematic reel · Premium album · 2 photographers'
  }
],

event: [
  {
    name: 'Small Event',
    price: '₹5,000 – ₹15,000',
    duration: '3 Hours',
    tagline: 'Perfect for small functions',
    inc: '3 hour coverage · 150 photos · Online gallery · 1 photographer'
  },
  {
    name: 'Full Coverage',
    price: '₹20,000 – ₹40,000',
    duration: 'Full Day',
    tagline: 'Best for large events',
    inc: 'Full day coverage · 400 photos · Highlight video · 2 photographers · Same-day edits',
    popular: true
  },
  {
    name: 'Premium Event',
    price: '₹40,000 – ₹80,000',
    duration: 'Full Day + Overtime',
    tagline: 'Ultimate event package',
    inc: 'Full day + overtime · Unlimited photos · Cinematic film · 3 photographers + videographer · Drone'
  }
]

};
const catLabels = {wedding:'Wedding',prewedding:'Pre-Wedding',savedate:'Save the Date',birthday:'Birthday',event:'Events'};

let selectedCategory = 'wedding';
let selectedIdx = 0;
let dropdownOpen = false;

const trigger  = document.getElementById('csTrigger');
const list     = document.getElementById('csList');
const preview  = document.getElementById('pkgPreview');

function renderPackages(category) {
  selectedCategory = category;
  document.getElementById('pkgColCat').textContent = catLabels[category];

  const pkgs = packages[category] || [];
  const defIdx = pkgs.findIndex(p => p.popular);
  selectedIdx = defIdx >= 0 ? defIdx : 0;

  buildList(pkgs);
  selectPackage(selectedIdx, pkgs[selectedIdx]);
}

function buildList(pkgs) {
  list.innerHTML = '';
  pkgs.forEach((pkg, i) => {
    const opt = document.createElement('div');
    opt.className = 'cs-option' + (i === selectedIdx ? ' selected' : '');
    opt.dataset.idx = i;
    opt.innerHTML = `
      <div class="cs-option-left">
        <div class="cs-option-name">${pkg.name}</div>
        <div class="cs-option-tagline">${pkg.tagline}</div>
      </div>
      <div class="cs-option-right">
        <div class="cs-option-price">${pkg.price}</div>
        ${pkg.popular ? '<div class="cs-badge">Popular</div>' : ''}
      </div>
      <div class="cs-option-tick"><svg viewBox="0 0 10 8"><polyline points="1,4 3.5,6.5 9,1"/></svg></div>`;
    opt.addEventListener('click', () => {
      selectedIdx = i;
      selectPackage(i, pkg);
      closeDropdown();
    });
    list.appendChild(opt);
  });
}

function selectPackage(idx, pkg) {
  // update trigger
  document.getElementById('csSelectedName').textContent  = pkg.name;
  document.getElementById('csSelectedPrice').textContent = pkg.price;

  // update option highlights
  list.querySelectorAll('.cs-option').forEach((o, i) => o.classList.toggle('selected', i === idx));

  // update preview
  document.getElementById('ppName').textContent  = pkg.name + ' Package';
  document.getElementById('ppPrice').textContent = pkg.price;
  document.getElementById('ppPills').innerHTML   = pkg.inc.split(' · ').map(p => `<span class="pp-pill">${p}</span>`).join('');
  preview.style.animation = 'none';
  void preview.offsetWidth;
  preview.style.animation = '';

  // update summary
  document.getElementById('selectedPackage').value = pkg.name;
  document.getElementById('sumCat').textContent    = catLabels[selectedCategory].toUpperCase();
  document.getElementById('sumPkg').textContent    = pkg.name + ' Package';
  document.getElementById('sumPrice').textContent  = pkg.price;
   document.getElementById('selectedPackage').value = pkg.name;
   document.getElementById('selectedPrice').value = pkg.price;
   document.getElementById('selectedDuration').value = pkg.duration;


   

}

function openDropdown()  { dropdownOpen = true;  list.classList.add('open');    trigger.classList.add('open'); }
function closeDropdown() { dropdownOpen = false; list.classList.remove('open'); trigger.classList.remove('open'); }

trigger.addEventListener('click', () => dropdownOpen ? closeDropdown() : openDropdown());

document.addEventListener('click', e => {
  if (!document.getElementById('customSelect').contains(e.target)) closeDropdown();
});

document.querySelectorAll('input[name="celebration"]').forEach(r => {
  r.addEventListener('change', function(){ renderPackages(this.value); });
});



renderPackages('wedding');

const pkgs = packages['wedding'];
const defaultPkg = pkgs.find(p => p.popular) || pkgs[0];


// ==============================
document
  .getElementById('bookingForm')
  .addEventListener('submit', async function(e){

    e.preventDefault();

    document.getElementById('selectedPrice').value =
      document.getElementById('sumPrice').textContent;

    const form =
      document.getElementById('bookingForm');

    const formData =
      new FormData(form);

    const response = await fetch(
      form.action,
      {
        method:'POST',
        body:formData
      }
    );

    const data = await response.json();

    if(data.success){

        document.getElementById('refNum')
          .innerText = data.reference;

        document.getElementById('successOverlay')
          .classList.add('show');

        form.reset();

    }
    else{

        showToast(data.message,'error');

    }

});