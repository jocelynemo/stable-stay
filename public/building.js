// building.js - individual building detail page

const buildingsData = [
  {
    id: 1, name: "The Meridian", price: 2400, city: "Jersey City", zip: "07302",
    beds: 2, baths: 1, sqft: 850, badge: "New",
    amenities: ["Gym", "Doorman", "Pet Friendly"],
    address: "142 Exchange Place", borough: "Hudson County",
    block: "1042", lot: "7", units: 48, rentStabilized: true,
    violationCount: 3, trustScore: 84,
    violations: [
      { date: "2024-11-12", code: "HMC §27-2017", description: "Mice/rats infestation in common area", severity: "Serious", status: "Open" },
      { date: "2024-08-03", code: "HMC §27-2013", description: "Defective floor tiles in hallway", severity: "Minor", status: "Closed" },
      { date: "2023-12-20", code: "HMC §27-2013", description: "Peeling paint in stairwell", severity: "Minor", status: "Closed" }
    ],
    avgRating: 4.2,
    reviews: [
      { user: "JaneD", rating: 5, text: "Great location, doorman is very helpful. Building is well maintained.", date: "2025-03-10" },
      { user: "MikeR", rating: 4, text: "Good value for the area. Gym is small but functional.", date: "2025-01-22" },
      { user: "SaraL", rating: 3, text: "Had some issues with heat last winter but management responded quickly.", date: "2024-12-05" }
    ],
    reportedIssues: [
      { user: "Tenant22", type: "Noise", description: "Loud neighbors on weekends past midnight.", date: "2025-02-14" }
    ],
    comments: [
      { user: "Alex_R", text: "Is parking included in the rent?", date: "2025-04-01" },
      { user: "Mgmt_Office", text: "Parking is available for an additional $150/month.", date: "2025-04-02" }
    ]
  },
  {
    id: 2, name: "Riverside Lofts", price: 1800, city: "Hoboken", zip: "07030",
    beds: 1, baths: 1, sqft: 620, badge: "Hot",
    amenities: ["Parking", "Laundry"],
    address: "88 River Street", borough: "Hudson County",
    block: "203", lot: "12", units: 24, rentStabilized: false,
    violationCount: 7, trustScore: 61,
    violations: [
      { date: "2025-01-08", code: "HMC §27-2029", description: "No heat in units during cold weather", severity: "Hazardous", status: "Open" },
      { date: "2024-10-15", code: "HMC §27-2017", description: "Cockroach infestation in basement", severity: "Serious", status: "Open" },
      { date: "2024-07-22", code: "HMC §27-2013", description: "Leaking roof causing water damage", severity: "Serious", status: "Closed" },
      { date: "2024-05-10", code: "HMC §27-2005", description: "Broken intercom system", severity: "Minor", status: "Closed" },
      { date: "2023-11-30", code: "HMC §27-2013", description: "Peeling paint in Unit 3B", severity: "Minor", status: "Closed" },
      { date: "2023-09-14", code: "HMC §27-2011", description: "Hot water supply inadequate", severity: "Serious", status: "Closed" },
      { date: "2023-06-02", code: "HMC §27-2005", description: "Front door lock broken", severity: "Serious", status: "Closed" }
    ],
    avgRating: 2.8,
    reviews: [
      { user: "TomH", rating: 2, text: "Heat went out twice this winter. Management was very slow to respond.", date: "2025-02-01" },
      { user: "LauraM", rating: 3, text: "Location is great but the building has had issues.", date: "2024-11-10" },
      { user: "RyanK", rating: 4, text: "Renovated unit is nice. Parking spot is a huge plus.", date: "2024-08-20" }
    ],
    reportedIssues: [
      { user: "Unit4A", type: "Maintenance Neglect", description: "Reported broken heater 3 weeks ago, still not fixed.", date: "2025-01-20" },
      { user: "Unit2C", type: "Pests", description: "Cockroaches in kitchen despite exterminator visit.", date: "2024-10-22" }
    ],
    comments: [
      { user: "ProspectiveTenant", text: "How is the noise from the street?", date: "2025-03-15" },
      { user: "CurrentResident", text: "River St gets noisy on weekend nights but it's manageable.", date: "2025-03-16" }
    ]
  },
  {
    id: 3, name: "Union Square Apts", price: 3100, city: "Union City", zip: "07087",
    beds: 3, baths: 2, sqft: 1150, badge: null,
    amenities: ["Gym", "Rooftop", "Pet Friendly"],
    address: "500 Bergenline Ave", borough: "Hudson County",
    block: "3301", lot: "4", units: 72, rentStabilized: true,
    violationCount: 1, trustScore: 91,
    violations: [
      { date: "2024-09-05", code: "HMC §27-2005", description: "Elevator inspection sticker expired", severity: "Minor", status: "Closed" }
    ],
    avgRating: 4.7,
    reviews: [
      { user: "CarlaP", rating: 5, text: "Rooftop is amazing. Management is very responsive.", date: "2025-04-01" },
      { user: "DanielW", rating: 5, text: "Best apartment I've had. Huge 3BR for the price.", date: "2025-02-18" },
      { user: "NinaS", rating: 4, text: "Pet friendly and the gym is surprisingly well equipped.", date: "2025-01-05" }
    ],
    reportedIssues: [],
    comments: [
      { user: "FutureRenter", text: "Are utilities included?", date: "2025-04-10" },
      { user: "CurrentTenant", text: "Water and heat are included, electricity is separate.", date: "2025-04-11" }
    ]
  },
  {
    id: 4, name: "Harbor View Towers", price: 2900, city: "Weehawken", zip: "07086",
    beds: 2, baths: 2, sqft: 980, badge: null,
    amenities: ["Doorman", "Parking", "Gym"],
    address: "1600 Harbor Blvd", borough: "Hudson County",
    block: "501", lot: "2", units: 120, rentStabilized: false,
    violationCount: 2, trustScore: 77,
    violations: [
      { date: "2024-12-01", code: "HMC §27-2013", description: "Damaged ceiling tiles in lobby", severity: "Minor", status: "Closed" },
      { date: "2024-06-18", code: "HMC §27-2005", description: "Gym equipment poses safety hazard", severity: "Serious", status: "Closed" }
    ],
    avgRating: 4.0,
    reviews: [
      { user: "JennaB", rating: 4, text: "Amazing views of the Hudson. Doorman is great.", date: "2025-03-20" },
      { user: "MarkT", rating: 4, text: "Parking is convenient. A bit pricey but worth it for the views.", date: "2025-01-14" }
    ],
    reportedIssues: [
      { user: "Unit8F", type: "Noise", description: "Construction noise starts at 7am on weekdays.", date: "2025-03-01" }
    ],
    comments: [
      { user: "LookingToMove", text: "Is the ferry to Manhattan nearby?", date: "2025-04-05" },
      { user: "Resident2yr", text: "Yes! Port Imperial Ferry is a 5 min walk.", date: "2025-04-05" }
    ]
  },
  {
    id: 5, name: "Palisade Commons", price: 1600, city: "North Bergen", zip: "07047",
    beds: 1, baths: 1, sqft: 570, badge: "Deal",
    amenities: ["Laundry", "Parking"],
    address: "7200 Palisade Ave", borough: "Hudson County",
    block: "2201", lot: "9", units: 36, rentStabilized: true,
    violationCount: 0, trustScore: 95,
    violations: [],
    avgRating: 4.5,
    reviews: [
      { user: "SophiaR", rating: 5, text: "Best deal in the area. Quiet street, parking included.", date: "2025-04-02" },
      { user: "EthanL", rating: 4, text: "Small but efficient layout. Laundry in building is a plus.", date: "2025-02-10" }
    ],
    reportedIssues: [],
    comments: [
      { user: "NewToArea", text: "How is the commute to NYC?", date: "2025-03-28" },
      { user: "Resident1yr", text: "Bus 156 takes about 25 min to Port Authority. Not bad!", date: "2025-03-28" }
    ]
  },
  {
    id: 6, name: "Exchange Place Suites", price: 3400, city: "Jersey City", zip: "07311",
    beds: 2, baths: 2, sqft: 1050, badge: "New",
    amenities: ["Gym", "Rooftop", "Doorman", "Pet Friendly"],
    address: "25 Exchange Place", borough: "Hudson County",
    block: "1105", lot: "1", units: 200, rentStabilized: false,
    violationCount: 0, trustScore: 93,
    violations: [],
    avgRating: 4.8,
    reviews: [
      { user: "ChrisM", rating: 5, text: "Brand new building, everything is top quality. Rooftop pool is incredible.", date: "2025-04-15" },
      { user: "AmandaK", rating: 5, text: "Concierge is helpful, gym is huge. Worth every penny.", date: "2025-03-30" },
      { user: "PeterJ", rating: 4, text: "Love it but it is pricey. Dog-friendly which is great.", date: "2025-02-20" }
    ],
    reportedIssues: [],
    comments: [
      { user: "Curious22", text: "Is there a waitlist for units?", date: "2025-04-12" },
      { user: "LeasingOffice", text: "Yes, a few units opening in June. Contact us directly.", date: "2025-04-13" }
    ]
  },
  {
    id: 7, name: "Lincoln Park Arms", price: 2200, city: "Jersey City", zip: "07304",
    beds: 2, baths: 1, sqft: 870, badge: null,
    amenities: ["Laundry", "Pet Friendly"],
    address: "350 Lincoln Park", borough: "Hudson County",
    block: "2410", lot: "3", units: 60, rentStabilized: true,
    violationCount: 4, trustScore: 72,
    violations: [
      { date: "2025-01-20", code: "HMC §27-2017", description: "Rodent droppings found in basement storage", severity: "Serious", status: "Open" },
      { date: "2024-09-11", code: "HMC §27-2013", description: "Water leak from ceiling in Unit 5C", severity: "Serious", status: "Closed" },
      { date: "2024-04-07", code: "HMC §27-2005", description: "Missing smoke detector in Unit 3A", severity: "Hazardous", status: "Closed" },
      { date: "2023-08-15", code: "HMC §27-2013", description: "Paint peeling in stairwell", severity: "Minor", status: "Closed" }
    ],
    avgRating: 3.5,
    reviews: [
      { user: "BrianF", rating: 3, text: "Decent apartment for the price. Park views are nice.", date: "2025-02-28" },
      { user: "LisaG", rating: 4, text: "Management has improved a lot over the past year.", date: "2025-01-10" }
    ],
    reportedIssues: [
      { user: "Tenant5C", type: "Maintenance Neglect", description: "Water stain on ceiling still present after repair.", date: "2025-02-05" }
    ],
    comments: [
      { user: "ParksLover", text: "How close is Lincoln Park actually?", date: "2025-03-10" },
      { user: "ParkResident", text: "Right across the street! Great for dogs.", date: "2025-03-10" }
    ]
  },
  {
    id: 8, name: "Bloomfield Flats", price: 1500, city: "Bloomfield", zip: "07003",
    beds: 1, baths: 1, sqft: 540, badge: null,
    amenities: ["Laundry"],
    address: "412 Broad Street", borough: "Essex County",
    block: "4102", lot: "15", units: 18, rentStabilized: false,
    violationCount: 2, trustScore: 68,
    violations: [
      { date: "2024-10-20", code: "HMC §27-2029", description: "Inadequate heating in common areas", severity: "Serious", status: "Closed" },
      { date: "2024-03-14", code: "HMC §27-2013", description: "Cracked tiles in bathroom of Unit 2B", severity: "Minor", status: "Closed" }
    ],
    avgRating: 3.2,
    reviews: [
      { user: "KarenW", rating: 3, text: "Affordable but basic. Heat was an issue last winter.", date: "2025-01-25" },
      { user: "JoshP", rating: 3, text: "Quiet neighborhood. Could use some updates to common areas.", date: "2024-11-08" }
    ],
    reportedIssues: [
      { user: "Unit1A", type: "Maintenance Neglect", description: "Hallway light has been out for 2 weeks.", date: "2025-03-22" }
    ],
    comments: []
  },
  {
    id: 9, name: "Summit Ridge", price: 2700, city: "Bayonne", zip: "07002",
    beds: 3, baths: 2, sqft: 1200, badge: null,
    amenities: ["Parking", "Pet Friendly", "Gym"],
    address: "900 Kennedy Blvd", borough: "Hudson County",
    block: "3805", lot: "6", units: 84, rentStabilized: true,
    violationCount: 1, trustScore: 88,
    violations: [
      { date: "2024-07-30", code: "HMC §27-2005", description: "Gym emergency exit sign not illuminated", severity: "Minor", status: "Closed" }
    ],
    avgRating: 4.3,
    reviews: [
      { user: "MirandaJ", rating: 5, text: "Spacious 3BR at a fair price. Gym is well maintained.", date: "2025-03-05" },
      { user: "DavidN", rating: 4, text: "Pet friendly and management is easy to reach. Parking is included!", date: "2025-01-18" },
      { user: "YvetteC", rating: 4, text: "Great for families. Very quiet building.", date: "2024-12-29" }
    ],
    reportedIssues: [],
    comments: [
      { user: "FamilyRenter", text: "Are there any 3BR units available now?", date: "2025-04-08" },
      { user: "Management", text: "One unit opening May 1st. Please contact our office.", date: "2025-04-08" }
    ]
  },
  {
    id: 10, name: "Metro East", price: 1950, city: "Kearny", zip: "07032",
    beds: 1, baths: 1, sqft: 680, badge: null,
    amenities: ["Laundry", "Parking"],
    address: "215 Kearny Ave", borough: "Hudson County",
    block: "1504", lot: "22", units: 32, rentStabilized: false,
    violationCount: 5, trustScore: 55,
    violations: [
      { date: "2025-02-10", code: "HMC §27-2017", description: "Mice infestation in Units 1A, 1B, 1C", severity: "Serious", status: "Open" },
      { date: "2024-11-05", code: "HMC §27-2029", description: "No hot water in building for 4 days", severity: "Hazardous", status: "Closed" },
      { date: "2024-08-20", code: "HMC §27-2013", description: "Water damage in ceiling of Unit 4D", severity: "Serious", status: "Closed" },
      { date: "2024-05-15", code: "HMC §27-2005", description: "Building entrance door lock broken", severity: "Serious", status: "Closed" },
      { date: "2023-12-10", code: "HMC §27-2013", description: "Paint peeling in multiple units", severity: "Minor", status: "Closed" }
    ],
    avgRating: 2.5,
    reviews: [
      { user: "TinaM", rating: 2, text: "Mice problem is serious and management is slow to act.", date: "2025-03-01" },
      { user: "CarlosB", rating: 3, text: "Affordable for the area but has had issues. Parking is convenient.", date: "2024-10-15" }
    ],
    reportedIssues: [
      { user: "Unit1B", type: "Pests", description: "Mice in kitchen. Set traps but they keep coming back.", date: "2025-02-15" },
      { user: "Unit3A", type: "Maintenance Neglect", description: "Hot water outage not fixed for a week.", date: "2024-11-08" }
    ],
    comments: [
      { user: "Considering", text: "Is the mice issue still ongoing?", date: "2025-04-10" },
      { user: "Unit1A_Res", text: "Yes, unfortunately still an issue as of April 2025.", date: "2025-04-11" }
    ]
  }
];

let currentBuilding = null;
let userFavorites = [];
let userReviews = {};
let userIssues = {};
let userComments = {};
let selectedStars = 0;

function loadFromStorage() {
  let favs = localStorage.getItem("favorites");
  if (favs !== null) userFavorites = JSON.parse(favs);

  let reviews = localStorage.getItem("userReviews");
  if (reviews !== null) userReviews = JSON.parse(reviews);

  let issues = localStorage.getItem("userIssues");
  if (issues !== null) userIssues = JSON.parse(issues);

  let comments = localStorage.getItem("userComments");
  if (comments !== null) userComments = JSON.parse(comments);
}

function isFavorited(id) {
  for (let i = 0; i < userFavorites.length; i++) {
    if (userFavorites[i] === id) return true;
  }
  return false;
}

function toggleFavorite() {
  let id = currentBuilding.id;
  let idx = -1;
  for (let i = 0; i < userFavorites.length; i++) {
    if (userFavorites[i] === id) { idx = i; break; }
  }
  if (idx !== -1) {
    userFavorites.splice(idx, 1);
    showToast("Removed from favorites");
  } else {
    userFavorites.push(id);
    showToast("Saved to favorites ♥");
  }
  localStorage.setItem("favorites", JSON.stringify(userFavorites));
  updateFavBtn();
}

function updateFavBtn() {
  let btn = document.getElementById("favBtn");
  if (btn === null) return;
  if (isFavorited(currentBuilding.id)) {
    btn.textContent = "♥ Saved";
    btn.classList.add("active");
  } else {
    btn.textContent = "♡ Save";
    btn.classList.remove("active");
  }
}

function getTrustColor(score) {
  if (score >= 80) return "var(--success)";
  if (score >= 60) return "var(--accent)";
  return "var(--danger)";
}

function getTrustLabel(score) {
  if (score >= 80) return "Good";
  if (score >= 60) return "Moderate";
  return "Poor";
}

function renderStars(rating) {
  let html = "";
  for (let i = 1; i <= 5; i++) {
    if (i <= Math.round(rating)) {
      html += '<span class="star filled">★</span>';
    } else {
      html += '<span class="star">☆</span>';
    }
  }
  return html;
}

function renderHero() {
  let b = currentBuilding;

  let rentBadge = b.rentStabilized
    ? '<span class="detail-badge badge-green">Rent Stabilized</span>'
    : '<span class="detail-badge badge-muted">Not Stabilized</span>';

  let listingBadge = b.badge !== null
    ? '<span class="detail-badge badge-white">' + b.badge + '</span>'
    : '';

  let favActive = isFavorited(b.id) ? "active" : "";
  let favText = isFavorited(b.id) ? "♥ Saved" : "♡ Save";

  let el = document.getElementById("buildingHero");
  el.innerHTML =
    '<div class="building-hero-top">' +
      '<div>' +
        '<div class="building-badges">' + rentBadge + listingBadge + '</div>' +
        '<h1 class="building-hero-name">' + b.name + '</h1>' +
        '<div class="building-hero-address">📍 ' + b.address + ', ' + b.city + ', NJ ' + b.zip + '</div>' +
        '<div class="building-hero-price">$' + b.price.toLocaleString() + '<span>/mo</span>&nbsp;&nbsp;·&nbsp;&nbsp;' +
          b.beds + ' bd&nbsp;&nbsp;·&nbsp;&nbsp;' + b.baths + ' ba&nbsp;&nbsp;·&nbsp;&nbsp;' + b.sqft + ' sqft</div>' +
      '</div>' +
      '<div class="building-hero-actions">' +
        '<button class="btn-fav ' + favActive + '" id="favBtn">' + favText + '</button>' +
        '<a href="/buildings" class="btn btn-ghost">← Back</a>' +
      '</div>' +
    '</div>';

  document.getElementById("favBtn").addEventListener("click", toggleFavorite);
}

function renderTrustScore() {
  let b = currentBuilding;
  let color = getTrustColor(b.trustScore);
  let label = getTrustLabel(b.trustScore);

  let violationScore = Math.max(0, 100 - b.violationCount * 12);
  let stabilizedScore = b.rentStabilized ? 100 : 35;
  let reviewScore = Math.round((b.avgRating / 5) * 100);

  let el = document.getElementById("trustScoreCard");
  el.innerHTML =
    '<div class="trust-score-big" style="color:' + color + '">' + b.trustScore + '</div>' +
    '<div class="trust-score-label" style="color:' + color + '">' + label + ' Trust Score</div>' +
    '<div class="trust-breakdown">' +
      makeTrustRow("Violations", violationScore) +
      makeTrustRow("Rent Status", stabilizedScore) +
      makeTrustRow("Reviews", reviewScore) +
    '</div>';
}

function makeTrustRow(label, score) {
  let color = getTrustColor(score);
  return '<div class="trust-breakdown-row">' +
    '<span>' + label + '</span>' +
    '<div class="trust-bar"><div class="trust-bar-fill" style="width:' + score + '%;background:' + color + '"></div></div>' +
    '<span>' + score + '</span>' +
  '</div>';
}

function renderBuildingInfo() {
  let b = currentBuilding;

  let amenityTagsHtml = '';
  for (let i = 0; i < b.amenities.length; i++) {
    amenityTagsHtml += '<span class="amenity-tag">' + b.amenities[i] + '</span>';
  }

  let el = document.getElementById("buildingInfoCard");
  el.innerHTML =
    makeInfoRow("Address", b.address + ', ' + b.city + ', NJ ' + b.zip) +
    makeInfoRow("County", b.borough) +
    makeInfoRow("Block / Lot", b.block + ' / ' + b.lot) +
    makeInfoRow("Total Units", b.units) +
    makeInfoRow("Rent Status", b.rentStabilized ? '✓ Rent Stabilized' : '✗ Not Stabilized') +
    makeInfoRow("Violations", b.violationCount + ' on record') +
    '<div class="info-row">' +
      '<span class="info-label">Amenities</span>' +
      '<span class="amenity-tags">' + amenityTagsHtml + '</span>' +
    '</div>';
}

function makeInfoRow(label, value) {
  return '<div class="info-row"><span class="info-label">' + label + '</span><span>' + value + '</span></div>';
}

function renderViolations() {
  let b = currentBuilding;
  let el = document.getElementById("violationsSection");

  if (b.violations.length === 0) {
    el.innerHTML = '<p class="empty-state">✓ No violations on record — a great sign!</p>';
    return;
  }

  let rows = '';
  for (let i = 0; i < b.violations.length; i++) {
    let v = b.violations[i];
    let sevClass = 'severity-' + v.severity.toLowerCase();
    let statusClass = v.status === 'Open' ? 'status-open' : 'status-closed';
    rows +=
      '<tr>' +
        '<td>' + v.date + '</td>' +
        '<td style="white-space:nowrap">' + v.code + '</td>' +
        '<td>' + v.description + '</td>' +
        '<td><span class="severity-badge ' + sevClass + '">' + v.severity + '</span></td>' +
        '<td><span class="status-badge ' + statusClass + '">' + v.status + '</span></td>' +
      '</tr>';
  }

  el.innerHTML =
    '<div style="overflow-x:auto">' +
    '<table class="violation-table">' +
      '<thead><tr>' +
        '<th data-col="0">Date</th>' +
        '<th data-col="1">Code</th>' +
        '<th data-col="2">Description</th>' +
        '<th data-col="3">Severity</th>' +
        '<th data-col="4">Status</th>' +
      '</tr></thead>' +
      '<tbody>' + rows + '</tbody>' +
    '</table>' +
    '</div>';

  // sortable columns
  let headers = el.querySelectorAll("th[data-col]");
  let sortDir = {};
  for (let i = 0; i < headers.length; i++) {
    headers[i].addEventListener("click", function() {
      let colIdx = parseInt(this.getAttribute("data-col"));
      sortDir[colIdx] = !sortDir[colIdx];
      let tbody = el.querySelector("tbody");
      let rowsArr = Array.prototype.slice.call(tbody.querySelectorAll("tr"));
      rowsArr.sort(function(a, b) {
        let aVal = a.children[colIdx].textContent.trim();
        let bVal = b.children[colIdx].textContent.trim();
        if (sortDir[colIdx]) return aVal > bVal ? 1 : -1;
        return aVal < bVal ? 1 : -1;
      });
      for (let j = 0; j < rowsArr.length; j++) tbody.appendChild(rowsArr[j]);
      for (let j = 0; j < headers.length; j++) headers[j].classList.remove("sort-asc", "sort-desc");
      this.classList.add(sortDir[colIdx] ? "sort-asc" : "sort-desc");
    });
  }
}

function renderReviews() {
  let b = currentBuilding;
  let el = document.getElementById("reviewsSection");
  let currentUser = authGetCurrentUser();

  // merge hardcoded + user-submitted reviews
  let extra = userReviews[b.id] ? userReviews[b.id] : [];
  let allReviews = b.reviews.concat(extra);
  allReviews.sort(function(a, c) { return a.date < c.date ? 1 : -1; });

  // average
  let total = 0;
  for (let i = 0; i < allReviews.length; i++) total += allReviews[i].rating;
  let avg = allReviews.length > 0 ? (total / allReviews.length).toFixed(1) : "—";

  // find current user's existing review (by email)
  let myReview = null;
  let myReviewIdx = -1;
  if (currentUser) {
    for (let i = 0; i < extra.length; i++) {
      if (extra[i].userEmail === currentUser.email) {
        myReview = extra[i];
        myReviewIdx = i;
        break;
      }
    }
  }

  // build review cards
  let cards = '';
  for (let i = 0; i < allReviews.length; i++) {
    let r = allReviews[i];
    let isOwn = currentUser && r.userEmail === currentUser.email;
    let textHtml = r.text
      ? '<p class="review-text">' + r.text + '</p>'
      : '<p class="review-text" style="font-style:italic;color:var(--text-dim);">No written review</p>';
    cards +=
      '<div class="review-card">' +
        '<div class="review-header">' +
          '<span class="review-user">' + r.user + (isOwn ? ' <span style="color:var(--accent);font-size:0.78rem;">(You)</span>' : '') + '</span>' +
          '<span class="review-stars">' + renderStars(r.rating) + '</span>' +
          '<span class="review-date">' + r.date + '</span>' +
        '</div>' +
        textHtml +
      '</div>';
  }

  // decide what form section to show
  let formHtml = '';
  if (!currentUser) {
    formHtml =
      '<div class="review-form-wrap" style="text-align:center;padding:24px 18px;">' +
        '<p style="color:var(--text-muted);margin-bottom:14px;">Sign in to leave a review.</p>' +
        '<button class="btn btn-primary" id="reviewSignInBtn">Sign In</button>' +
      '</div>';
  } else if (myReview !== null) {
    formHtml =
      '<div class="review-form-wrap" id="myReviewWrap">' +
        '<div class="detail-section-subtitle">Your Review</div>' +
        '<div style="display:flex;align-items:center;gap:12px;margin-bottom:8px;">' +
          '<span style="font-size:1.1rem;">' + renderStars(myReview.rating) + '</span>' +
          '<span style="font-size:0.8rem;color:var(--text-muted);">' + myReview.date + '</span>' +
        '</div>' +
        (myReview.text ? '<p style="font-size:0.9rem;color:var(--text-muted);margin-bottom:14px;">' + myReview.text + '</p>' : '') +
        '<div style="display:flex;gap:10px;">' +
          '<button class="btn btn-ghost" id="editReviewBtn">Edit</button>' +
          '<button class="btn btn-ghost" id="deleteReviewBtn" style="color:var(--danger);border-color:rgba(248,113,113,0.3);">Delete</button>' +
        '</div>' +
      '</div>';
  } else {
    formHtml = buildReviewForm(false, 0, '');
  }

  el.innerHTML =
    '<div class="avg-rating-row">' +
      '<span class="avg-rating-big">' + avg + '</span>' +
      '<div>' +
        '<div class="avg-stars">' + renderStars(parseFloat(avg) || 0) + '</div>' +
        '<div class="avg-count">' + allReviews.length + ' review' + (allReviews.length !== 1 ? 's' : '') + '</div>' +
      '</div>' +
    '</div>' +
    formHtml +
    '<div class="reviews-list">' + (cards || '<p class="empty-state">No reviews yet. Be the first!</p>') + '</div>';

  // wire sign-in prompt button
  let reviewSignInBtn = el.querySelector("#reviewSignInBtn");
  if (reviewSignInBtn) {
    reviewSignInBtn.addEventListener("click", function() { authOpenModal("signin"); });
  }

  // wire new-review form
  if (!currentUser || myReview === null) {
    wireReviewForm(el, b, currentUser, false, myReview, myReviewIdx);
  }

  // wire edit button
  let editBtn = el.querySelector("#editReviewBtn");
  if (editBtn) {
    editBtn.addEventListener("click", function() {
      let wrap = document.getElementById("myReviewWrap");
      wrap.outerHTML = buildReviewForm(true, myReview.rating, myReview.text || '');
      wireReviewForm(el, b, currentUser, true, myReview, myReviewIdx);
    });
  }

  // wire delete button
  let deleteBtn = el.querySelector("#deleteReviewBtn");
  if (deleteBtn) {
    deleteBtn.addEventListener("click", function() {
      userReviews[b.id].splice(myReviewIdx, 1);
      localStorage.setItem("userReviews", JSON.stringify(userReviews));
      showToast("Review deleted.");
      renderReviews();
    });
  }
}

function buildReviewForm(isEdit, preRating, preText) {
  let title = isEdit ? "Edit Your Review" : "Leave a Review";
  let btnLabel = isEdit ? "Update Review" : "Submit Review";
  let cancelBtn = isEdit ? '<button class="btn btn-ghost" id="cancelEditBtn">Cancel</button>' : '';
  return (
    '<div class="review-form-wrap" id="myReviewWrap">' +
      '<div class="detail-section-subtitle">' + title + '</div>' +
      '<div class="star-input" id="starInput" data-pre="' + preRating + '">' +
        '<span class="star-pick" data-val="1">★</span>' +
        '<span class="star-pick" data-val="2">★</span>' +
        '<span class="star-pick" data-val="3">★</span>' +
        '<span class="star-pick" data-val="4">★</span>' +
        '<span class="star-pick" data-val="5">★</span>' +
      '</div>' +
      '<textarea id="reviewText" placeholder="Optional — stars alone are fine too" rows="3">' + preText + '</textarea>' +
      '<div style="display:flex;gap:10px;">' +
        '<button class="btn btn-primary" id="submitReview">' + btnLabel + '</button>' +
        cancelBtn +
      '</div>' +
    '</div>'
  );
}

function wireReviewForm(el, b, currentUser, isEdit, myReview, myReviewIdx) {
  selectedStars = 0;
  let picks = el.querySelectorAll(".star-pick");

  // pre-fill stars if editing
  let starInput = el.querySelector(".star-input");
  if (starInput) {
    let pre = parseInt(starInput.getAttribute("data-pre")) || 0;
    selectedStars = pre;
    highlightStars(picks, selectedStars);
  }

  for (let i = 0; i < picks.length; i++) {
    picks[i].addEventListener("click", function() {
      selectedStars = parseInt(this.getAttribute("data-val"));
      highlightStars(picks, selectedStars);
    });
    picks[i].addEventListener("mouseover", function() {
      highlightStars(picks, parseInt(this.getAttribute("data-val")));
    });
  }
  if (starInput) {
    starInput.addEventListener("mouseleave", function() {
      highlightStars(picks, selectedStars);
    });
  }

  let submitBtn = el.querySelector("#submitReview");
  if (submitBtn) {
    submitBtn.addEventListener("click", function() {
      if (selectedStars === 0) { showToast("Please select a star rating."); return; }
      let text = document.getElementById("reviewText").value.trim();
      let displayName = currentUser.firstName + " " + currentUser.lastName.charAt(0) + ".";
      let review = {
        user: displayName,
        userEmail: currentUser.email,
        rating: selectedStars,
        text: text,
        date: new Date().toISOString().slice(0, 10)
      };
      if (!userReviews[b.id]) userReviews[b.id] = [];
      if (isEdit) {
        userReviews[b.id][myReviewIdx] = review;
        showToast("Review updated!");
      } else {
        userReviews[b.id].push(review);
        showToast("Review submitted!");
      }
      localStorage.setItem("userReviews", JSON.stringify(userReviews));
      renderReviews();
    });
  }

  let cancelBtn = el.querySelector("#cancelEditBtn");
  if (cancelBtn) {
    cancelBtn.addEventListener("click", function() {
      renderReviews();
    });
  }
}

function highlightStars(picks, val) {
  for (let i = 0; i < picks.length; i++) {
    if (parseInt(picks[i].getAttribute("data-val")) <= val) {
      picks[i].classList.add("active");
    } else {
      picks[i].classList.remove("active");
    }
  }
}

function renderIssues() {
  let b = currentBuilding;
  let el = document.getElementById("issuesSection");

  let extra = userIssues[b.id] ? userIssues[b.id] : [];
  let all = b.reportedIssues.concat(extra);

  let cards = '';
  for (let i = 0; i < all.length; i++) {
    let issue = all[i];
    cards +=
      '<div class="issue-card">' +
        '<div class="issue-header">' +
          '<span class="issue-type">' + issue.type + '</span>' +
          '<span class="issue-user">' + issue.user + ' · ' + issue.date + '</span>' +
        '</div>' +
        '<p class="issue-desc">' + issue.description + '</p>' +
      '</div>';
  }

  el.innerHTML =
    '<div class="issue-form-wrap">' +
      '<div class="detail-section-subtitle">Report an Issue</div>' +
      '<select id="issueType" class="filter-input">' +
        '<option value="">Select issue type</option>' +
        '<option>Pests</option>' +
        '<option>Noise</option>' +
        '<option>Maintenance Neglect</option>' +
        '<option>Safety Concern</option>' +
        '<option>Other</option>' +
      '</select>' +
      '<textarea id="issueText" placeholder="Describe the issue..." rows="3"></textarea>' +
      '<button class="btn btn-primary" id="submitIssue">Report Issue</button>' +
    '</div>' +
    '<div class="issues-list">' + (cards || '<p class="empty-state">No issues reported yet.</p>') + '</div>';

  el.querySelector("#submitIssue").addEventListener("click", function() {
    let type = document.getElementById("issueType").value;
    let text = document.getElementById("issueText").value.trim();
    if (!type) { showToast("Please select an issue type."); return; }
    if (!text) { showToast("Please describe the issue."); return; }
    let issue = { user: "You", type: type, description: text, date: new Date().toISOString().slice(0, 10) };
    if (!userIssues[b.id]) userIssues[b.id] = [];
    userIssues[b.id].push(issue);
    localStorage.setItem("userIssues", JSON.stringify(userIssues));
    showToast("Issue reported!");
    renderIssues();
  });
}

function renderComments() {
  let b = currentBuilding;
  let el = document.getElementById("commentsSection");

  let extra = userComments[b.id] ? userComments[b.id] : [];
  let all = b.comments.concat(extra);

  let cards = '';
  for (let i = 0; i < all.length; i++) {
    let c = all[i];
    cards +=
      '<div class="comment-card">' +
        '<div class="comment-header">' +
          '<span class="comment-user">' + c.user + '</span>' +
          '<span class="comment-date">' + c.date + '</span>' +
        '</div>' +
        '<p class="comment-text">' + c.text + '</p>' +
      '</div>';
  }

  el.innerHTML =
    '<div class="comment-form-wrap">' +
      '<textarea id="commentText" placeholder="Ask a question or leave a comment..." rows="2"></textarea>' +
      '<button class="btn btn-primary" id="submitComment">Post Comment</button>' +
    '</div>' +
    '<div class="comments-list">' + (cards || '<p class="empty-state">No comments yet. Start the conversation!</p>') + '</div>';

  el.querySelector("#submitComment").addEventListener("click", function() {
    let text = document.getElementById("commentText").value.trim();
    if (!text) { showToast("Please write a comment."); return; }
    let comment = { user: "You", text: text, date: new Date().toISOString().slice(0, 10) };
    if (!userComments[b.id]) userComments[b.id] = [];
    userComments[b.id].push(comment);
    localStorage.setItem("userComments", JSON.stringify(userComments));
    showToast("Comment posted!");
    renderComments();
  });
}

function showToast(message) {
  let toast = document.getElementById("toast");
  if (toast === null) return;
  toast.textContent = message;
  toast.classList.add("show");
  setTimeout(function() { toast.classList.remove("show"); }, 2800);
}

function init() {
  loadFromStorage();

  let params = new URLSearchParams(window.location.search);
  let id = parseInt(params.get("id"));

  for (let i = 0; i < buildingsData.length; i++) {
    if (buildingsData[i].id === id) {
      currentBuilding = buildingsData[i];
      break;
    }
  }

  if (currentBuilding === null) {
    document.body.innerHTML =
      '<div style="text-align:center;padding:80px 24px;">' +
        '<h2 style="font-family:var(--font-display);margin-bottom:16px;">Building not found.</h2>' +
        '<a href="/buildings" class="btn btn-primary">← Back to Listings</a>' +
      '</div>';
    return;
  }

  document.title = currentBuilding.name + " — StableStay";

  renderHero();
  renderTrustScore();
  renderBuildingInfo();
  renderViolations();
  renderReviews();
  renderIssues();
  renderComments();
}

document.addEventListener("DOMContentLoaded", init);
