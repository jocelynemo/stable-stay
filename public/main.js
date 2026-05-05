// main.js - landing page logic

// sample listings data for the featured section
const featuredListings = [
  {
    id: 1,
    name: "The Meridian",
    price: 2400,
    city: "Jersey City",
    zip: "07302",
    beds: 2,
    baths: 1,
    sqft: 850,
    badge: "New",
    img: null
  },
  {
    id: 2,
    name: "Riverside Lofts",
    price: 1800,
    city: "Hoboken",
    zip: "07030",
    beds: 1,
    baths: 1,
    sqft: 620,
    badge: "Hot",
    img: null
  },
  {
    id: 3,
    name: "Union Square Apts",
    price: 3100,
    city: "Union City",
    zip: "07087",
    beds: 3,
    baths: 2,
    sqft: 1150,
    badge: null,
    img: null
  }
];

// track which listings are favorited
let favorites = [];

// build a listing card and return the element
function buildListingCard(listing) {
  let card = document.createElement("div");
  card.className = "listing-card";
  card.setAttribute("data-id", listing.id);

  // image section
  let imgWrap = document.createElement("div");
  imgWrap.className = "listing-img";

  let placeholder = document.createElement("div");
  placeholder.className = "img-placeholder";
  placeholder.innerHTML = '<span class="icon">🏢</span><span>' + listing.name + '</span>';
  imgWrap.appendChild(placeholder);

  // badge
  if (listing.badge !== null) {
    let badge = document.createElement("span");
    badge.className = "listing-badge";
    badge.textContent = listing.badge;
    imgWrap.appendChild(badge);
  }

  // fav button
  let favBtn = document.createElement("button");
  favBtn.className = "fav-btn";
  favBtn.setAttribute("data-id", listing.id);
  favBtn.title = "Add to favorites";
  favBtn.textContent = "♡";
  favBtn.addEventListener("click", function(e) {
    e.stopPropagation();
    toggleFavorite(listing.id, favBtn);
  });
  imgWrap.appendChild(favBtn);

  card.appendChild(imgWrap);

  // info section
  let info = document.createElement("div");
  info.className = "listing-info";

  let price = document.createElement("div");
  price.className = "listing-price";
  price.innerHTML = "$" + listing.price.toLocaleString() + '<span>/mo</span>';

  let name = document.createElement("div");
  name.className = "listing-name";
  name.textContent = listing.name;

  let location = document.createElement("div");
  location.className = "listing-location";
  location.textContent = "📍 " + listing.city + ", NJ " + listing.zip;

  let meta = document.createElement("div");
  meta.className = "listing-meta";

  let metaBeds = document.createElement("div");
  metaBeds.className = "listing-meta-item";
  metaBeds.textContent = "🛏 " + listing.beds + " bd";

  let metaBaths = document.createElement("div");
  metaBaths.className = "listing-meta-item";
  metaBaths.textContent = "🚿 " + listing.baths + " ba";

  let metaSqft = document.createElement("div");
  metaSqft.className = "listing-meta-item";
  metaSqft.textContent = "📐 " + listing.sqft + " sqft";

  meta.appendChild(metaBeds);
  meta.appendChild(metaBaths);
  meta.appendChild(metaSqft);

  info.appendChild(price);
  info.appendChild(name);
  info.appendChild(location);
  info.appendChild(meta);

  card.appendChild(info);

  // click card goes to buildings page
  card.addEventListener("click", function() {
    window.location.href = "/buildings";
  });

  return card;
}

// render featured listings into the grid
function renderFeaturedListings() {
  let grid = document.getElementById("featuredGrid");
  if (grid === null) return;

  for (let i = 0; i < featuredListings.length; i++) {
    let card = buildListingCard(featuredListings[i]);
    grid.appendChild(card);
  }
}

// toggle favorite status
function toggleFavorite(id, btn) {
  let alreadyFaved = false;
  let favIndex = -1;

  for (let i = 0; i < favorites.length; i++) {
    if (favorites[i] === id) {
      alreadyFaved = true;
      favIndex = i;
      break;
    }
  }

  if (alreadyFaved) {
    favorites.splice(favIndex, 1);
    btn.classList.remove("active");
    btn.textContent = "♡";
    showToast("Removed from favorites");
  } else {
    favorites.push(id);
    btn.classList.add("active");
    btn.textContent = "♥";
    showToast("Added to favorites ♥");
  }

  // save to localStorage
  localStorage.setItem("favorites", JSON.stringify(favorites));
}

// load favorites from localStorage
function loadFavorites() {
  let stored = localStorage.getItem("favorites");
  if (stored !== null) {
    favorites = JSON.parse(stored);
  }
}

// show a small toast notification
function showToast(message) {
  let toast = document.getElementById("toast");
  if (toast === null) return;
  toast.textContent = message;
  toast.classList.add("show");

  setTimeout(function() {
    toast.classList.remove("show");
  }, 2800);
}

// handle the hero search
function handleHeroSearch() {
  let input = document.getElementById("heroSearch");
  let query = input.value.trim();
  if (query !== "") {
    // pass query as url param to buildings page
    window.location.href = "/buildings?search=" + encodeURIComponent(query);
  } else {
    window.location.href = "/buildings";
  }
}

// contact form submit
function handleContactSubmit(e) {
  e.preventDefault();
  showToast("Message sent! We'll get back to you soon.");
  e.target.reset();
}

// wire up all the event listeners
function init() {
  loadFavorites();
  renderFeaturedListings();

  // hero search
  let heroSearchBtn = document.getElementById("heroSearchBtn");
  if (heroSearchBtn !== null) {
    heroSearchBtn.addEventListener("click", handleHeroSearch);
  }

  let heroSearchInput = document.getElementById("heroSearch");
  if (heroSearchInput !== null) {
    heroSearchInput.addEventListener("keydown", function(e) {
      if (e.key === "Enter") {
        handleHeroSearch();
      }
    });
  }

  // contact form
  let contactForm = document.getElementById("contactForm");
  if (contactForm !== null) {
    contactForm.addEventListener("submit", handleContactSubmit);
  }

}

// ── Survey ────────────────────────────────────────────────────────────────────

var surveyAnswers = { budget: null, beds: null, priority: null };

function initSurvey() {
  function wireGroup(groupId, key) {
    var group = document.getElementById(groupId);
    if (!group) return;
    var opts = group.querySelectorAll(".survey-opt");
    for (var i = 0; i < opts.length; i++) {
      opts[i].addEventListener("click", function() {
        for (var j = 0; j < opts.length; j++) opts[j].classList.remove("selected");
        this.classList.add("selected");
        surveyAnswers[key] = this.getAttribute("data-val");
      });
    }
  }

  wireGroup("surveyBudget",   "budget");
  wireGroup("surveyBeds",     "beds");
  wireGroup("surveyPriority", "priority");

  var submitBtn = document.getElementById("surveySubmit");
  if (!submitBtn) return;
  submitBtn.addEventListener("click", function() {
    if (!surveyAnswers.budget || !surveyAnswers.beds || !surveyAnswers.priority) {
      showToast("Please answer all 3 questions.");
      return;
    }

    // Build a URL to buildings page with the matching filters
    var maxPrice = parseInt(surveyAnswers.budget);
    var beds     = surveyAnswers.beds;
    var params   = "?maxPrice=" + maxPrice + "&beds=" + beds + "&sort=" + surveyAnswers.priority;

    var titles = {
      price:     "Budget-Friendly Picks",
      trust:     "Highly Trusted Buildings",
      amenities: "Best Amenity Packages",
      space:     "Most Spacious Units"
    };

    var resultTitle = document.getElementById("surveyResultTitle");
    var resultText  = document.getElementById("surveyResultText");
    var resultLink  = document.getElementById("surveyResultLink");

    if (resultTitle) resultTitle.textContent = titles[surveyAnswers.priority] || "Your Matches";
    if (resultText)  resultText.textContent  = "We filtered " + (surveyAnswers.beds === "3" ? "3+ BR" : surveyAnswers.beds + " BR") +
      " rentals under $" + maxPrice.toLocaleString() + "/mo prioritizing " + surveyAnswers.priority + ".";
    if (resultLink)  resultLink.href = "/buildings" + params;

    document.getElementById("surveyForm").style.display = "none";
    var result = document.getElementById("surveyResult");
    if (result) result.style.display = "block";
  });
}

// ── Init ──────────────────────────────────────────────────────────────────────

document.addEventListener("DOMContentLoaded", init);
document.addEventListener("DOMContentLoaded", initSurvey);
