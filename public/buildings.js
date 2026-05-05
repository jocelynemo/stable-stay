// buildings.js - buildings/listings page logic

var activeTab = "all";
var favorites = [];
var leafletMap = null;
var mapMarkers = [];

var filters = {
  city: "",
  zip: "",
  minPrice: "",
  maxPrice: "",
  beds: null,
  amenities: []
};

function loadFavorites() {
  var stored = localStorage.getItem("favorites");
  if (stored !== null) favorites = JSON.parse(stored);
}

function isFavorited(id) {
  for (var i = 0; i < favorites.length; i++) {
    if (favorites[i] === id) return true;
  }
  return false;
}

function toggleFavorite(id, btn) {
  var idx = -1;
  for (var i = 0; i < favorites.length; i++) {
    if (favorites[i] === id) { idx = i; break; }
  }
  if (idx !== -1) {
    favorites.splice(idx, 1);
    btn.classList.remove("active");
    btn.textContent = "♡";
    showToast("Removed from favorites");
  } else {
    favorites.push(id);
    btn.classList.add("active");
    btn.textContent = "♥";
    showToast("Saved to favorites ♥");
  }
  localStorage.setItem("favorites", JSON.stringify(favorites));
  if (activeTab === "favorites") applyAndRender();
}

function getFilteredListings() {
  var all = window.getBuildings();
  var results = [];

  for (var i = 0; i < all.length; i++) {
    var listing = all[i];

    if (activeTab === "favorites" && !isFavorited(listing.id)) continue;

    if (filters.city !== "") {
      if (listing.city.toLowerCase().indexOf(filters.city.toLowerCase()) === -1) continue;
    }
    if (filters.zip !== "") {
      if (listing.zip.indexOf(filters.zip) === -1) continue;
    }
    if (filters.minPrice !== "") {
      if (listing.price < parseInt(filters.minPrice)) continue;
    }
    if (filters.maxPrice !== "") {
      if (listing.price > parseInt(filters.maxPrice)) continue;
    }
    if (filters.beds !== null) {
      if (filters.beds === 4) {
        if (listing.beds < 4) continue;
      } else {
        if (listing.beds !== filters.beds) continue;
      }
    }
    if (filters.amenities.length > 0) {
      var hasAll = true;
      for (var j = 0; j < filters.amenities.length; j++) {
        var found = false;
        var ams = listing.amenities || [];
        for (var k = 0; k < ams.length; k++) {
          if (ams[k] === filters.amenities[j]) { found = true; break; }
        }
        if (!found) { hasAll = false; break; }
      }
      if (!hasAll) continue;
    }

    results.push(listing);
  }
  return results;
}

function buildCard(listing) {
  var card = document.createElement("div");
  card.className = "listing-card";

  var imgWrap = document.createElement("div");
  imgWrap.className = "listing-img";

  var placeholder = document.createElement("div");
  placeholder.className = "img-placeholder";
  placeholder.innerHTML = '<span class="icon">🏢</span><span>' + listing.name + '</span>';
  imgWrap.appendChild(placeholder);

  if (listing.badge) {
    var badge = document.createElement("span");
    badge.className = "listing-badge";
    badge.textContent = listing.badge;
    imgWrap.appendChild(badge);
  }

  var favBtn = document.createElement("button");
  favBtn.className = "fav-btn" + (isFavorited(listing.id) ? " active" : "");
  favBtn.textContent = isFavorited(listing.id) ? "♥" : "♡";
  favBtn.title = "Save to favorites";
  favBtn.addEventListener("click", function(e) {
    e.stopPropagation();
    toggleFavorite(listing.id, favBtn);
  });
  imgWrap.appendChild(favBtn);
  card.appendChild(imgWrap);

  var info = document.createElement("div");
  info.className = "listing-info";

  var price = document.createElement("div");
  price.className = "listing-price";
  price.innerHTML = "$" + listing.price.toLocaleString() + '<span>/mo</span>';

  var name = document.createElement("div");
  name.className = "listing-name";
  name.textContent = listing.name;

  var location = document.createElement("div");
  location.className = "listing-location";
  location.textContent = "📍 " + listing.city + ", NJ " + listing.zip;

  var meta = document.createElement("div");
  meta.className = "listing-meta";
  meta.innerHTML =
    '<div class="listing-meta-item">🛏 ' + listing.beds + ' bd</div>' +
    '<div class="listing-meta-item">🚿 ' + listing.baths + ' ba</div>' +
    '<div class="listing-meta-item">📐 ' + listing.sqft + ' sqft</div>';

  info.appendChild(price);
  info.appendChild(name);
  info.appendChild(location);
  info.appendChild(meta);
  card.appendChild(info);

  card.addEventListener("click", function() {
    window.location.href = "/buildings/building?id=" + listing.id;
  });

  return card;
}

function renderListings(listings) {
  var grid = document.getElementById("listingsGrid");
  if (!grid) return;
  grid.innerHTML = "";

  var countEl = document.getElementById("listingsCount");
  if (countEl) countEl.innerHTML = "<strong>" + listings.length + "</strong> rentals found";

  if (listings.length === 0) {
    var empty = document.createElement("div");
    empty.style.gridColumn = "1 / -1";
    empty.style.textAlign = "center";
    empty.style.padding = "60px 0";
    empty.style.color = "var(--text-muted)";
    empty.textContent = "No listings match your filters.";
    grid.appendChild(empty);
    return;
  }

  for (var i = 0; i < listings.length; i++) {
    grid.appendChild(buildCard(listings[i]));
  }
}

function applyAndRender() {
  var listings = getFilteredListings();
  renderListings(listings);
  if (leafletMap) updateMapPins(listings);
}

function readFilters() {
  var cityEl = document.getElementById("filterCity");
  if (cityEl) filters.city = cityEl.value.trim();
  var zipEl = document.getElementById("filterZip");
  if (zipEl) filters.zip = zipEl.value.trim();
  var minEl = document.getElementById("filterMinPrice");
  if (minEl) filters.minPrice = minEl.value.trim();
  var maxEl = document.getElementById("filterMaxPrice");
  if (maxEl) filters.maxPrice = maxEl.value.trim();

  filters.amenities = [];
  var boxes = document.querySelectorAll(".amenity-check:checked");
  for (var i = 0; i < boxes.length; i++) filters.amenities.push(boxes[i].value);
}

function resetFilters() {
  filters = { city: "", zip: "", minPrice: "", maxPrice: "", beds: null, amenities: [] };

  var ids = ["filterCity", "filterZip", "filterMinPrice", "filterMaxPrice"];
  for (var i = 0; i < ids.length; i++) {
    var el = document.getElementById(ids[i]);
    if (el) el.value = "";
  }
  var bedBtns = document.querySelectorAll(".bed-btn");
  for (var j = 0; j < bedBtns.length; j++) bedBtns[j].classList.remove("active");
  var boxes = document.querySelectorAll(".amenity-check");
  for (var k = 0; k < boxes.length; k++) boxes[k].checked = false;

  applyAndRender();
}

function checkSearchParam() {
  var params = new URLSearchParams(window.location.search);
  var search = params.get("search");
  if (search) {
    var cityEl = document.getElementById("filterCity");
    if (cityEl) cityEl.value = search;
    filters.city = search;
  }

  // survey params
  var maxPrice = params.get("maxPrice");
  if (maxPrice) {
    filters.maxPrice = maxPrice;
    var maxEl = document.getElementById("filterMaxPrice");
    if (maxEl) maxEl.value = maxPrice;
  }
  var beds = params.get("beds");
  if (beds) {
    filters.beds = parseInt(beds);
    var bedBtns = document.querySelectorAll(".bed-btn");
    for (var i = 0; i < bedBtns.length; i++) {
      if (parseInt(bedBtns[i].getAttribute("data-beds")) === filters.beds) {
        bedBtns[i].classList.add("active");
      }
    }
  }
}

// ── Leaflet map ───────────────────────────────────────────────────────────────

function initMap() {
  if (leafletMap) return;
  leafletMap = L.map("buildingsMap").setView([40.74, -74.03], 11);
  L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
    attribution: '&copy; <a href="https://carto.com/">CARTO</a>',
    maxZoom: 19
  }).addTo(leafletMap);
}

function updateMapPins(listings) {
  for (var i = 0; i < mapMarkers.length; i++) mapMarkers[i].remove();
  mapMarkers = [];

  for (var j = 0; j < listings.length; j++) {
    var b = listings[j];
    if (!b.lat || !b.lng) continue;

    var marker = L.circleMarker([b.lat, b.lng], {
      radius: 10,
      fillColor: "#f0a03c",
      color: "#f7b862",
      weight: 2,
      opacity: 1,
      fillOpacity: 0.85
    }).addTo(leafletMap);

    marker.bindPopup(
      '<div style="font-family:sans-serif;min-width:160px;">' +
      '<strong>' + b.name + '</strong><br>' +
      '<span style="color:#888;font-size:0.82rem;">' + b.city + ', NJ</span><br>' +
      '<span style="color:#f0a03c;font-weight:700;font-size:1rem;">$' + b.price.toLocaleString() + '/mo</span><br>' +
      '<a href="/buildings/building?id=' + b.id + '" style="color:#f0a03c;font-size:0.82rem;">View Details →</a>' +
      '</div>'
    );

    mapMarkers.push(marker);
  }
}

function switchToMapView() {
  document.getElementById("listingsGrid").style.display = "none";
  document.getElementById("mapView").style.display = "block";
  document.getElementById("viewGrid").classList.remove("active");
  document.getElementById("viewMap").classList.add("active");

  initMap();
  updateMapPins(getFilteredListings());
  setTimeout(function() { leafletMap.invalidateSize(); }, 100);
}

function switchToGridView() {
  document.getElementById("listingsGrid").style.display = "";
  document.getElementById("mapView").style.display = "none";
  document.getElementById("viewGrid").classList.add("active");
  document.getElementById("viewMap").classList.remove("active");
}

// ── Toast ─────────────────────────────────────────────────────────────────────

function showToast(message) {
  var toast = document.getElementById("toast");
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add("show");
  setTimeout(function() { toast.classList.remove("show"); }, 2800);
}

// ── Init ──────────────────────────────────────────────────────────────────────

function init() {
  loadFavorites();
  checkSearchParam();
  applyAndRender();

  // tab buttons
  var tabBtns = document.querySelectorAll(".tab-btn");
  for (var i = 0; i < tabBtns.length; i++) {
    tabBtns[i].addEventListener("click", function() {
      for (var j = 0; j < tabBtns.length; j++) tabBtns[j].classList.remove("active");
      this.classList.add("active");
      activeTab = this.getAttribute("data-tab");
      applyAndRender();
    });
  }

  // bed buttons
  var bedBtns = document.querySelectorAll(".bed-btn");
  for (var i = 0; i < bedBtns.length; i++) {
    bedBtns[i].addEventListener("click", function() {
      var val = parseInt(this.getAttribute("data-beds"));
      if (filters.beds === val) {
        filters.beds = null;
        this.classList.remove("active");
      } else {
        filters.beds = val;
        for (var j = 0; j < bedBtns.length; j++) bedBtns[j].classList.remove("active");
        this.classList.add("active");
      }
    });
  }

  var applyBtn = document.getElementById("applyFilters");
  if (applyBtn) applyBtn.addEventListener("click", function() { readFilters(); applyAndRender(); });

  var resetBtn = document.getElementById("resetFilters");
  if (resetBtn) resetBtn.addEventListener("click", resetFilters);

  // sort
  var sortSelect = document.getElementById("sortSelect");
  if (sortSelect) {
    sortSelect.addEventListener("change", function() {
      var val = this.value;
      var listings = getFilteredListings();
      if (val === "price-asc") {
        listings.sort(function(a, b) { return a.price - b.price; });
      } else if (val === "price-desc") {
        listings.sort(function(a, b) { return b.price - a.price; });
      } else if (val === "sqft-desc") {
        listings.sort(function(a, b) { return b.sqft - a.sqft; });
      }
      renderListings(listings);
    });
  }

  // view toggle
  var viewGridBtn = document.getElementById("viewGrid");
  var viewMapBtn  = document.getElementById("viewMap");
  if (viewGridBtn) viewGridBtn.addEventListener("click", switchToGridView);
  if (viewMapBtn)  viewMapBtn.addEventListener("click", switchToMapView);
}

document.addEventListener("DOMContentLoaded", init);
