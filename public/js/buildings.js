//buildings.js: buildings/listings page logic

var activeTab      = "all";
var favorites      = [];
var leafletMap     = null;
var mapMarkers     = [];
var miniMaps       = [];
var pendingMiniMaps = [];
var currentPage    = 1;
var PAGE_SIZE      = 20;
var currentSort    = "default";

var filters = {
  city: "",
  zip: "",
  minPrice: "",
  maxPrice: "",
  beds: null,
  amenities: []
};

function loadFavorites() {
  favorites = window.USER_FAVORITES || [];
}

function isFavorited(id) {
  for (var i = 0; i < favorites.length; i++) {
    if (favorites[i] === id) {
      return true;
    }
  }
  return false;
}

function toggleFavorite(id, btn) {
  if (!window.SESSION_LOGGED_IN) {
    authOpenModal('signin');
    return;
  }
  fetch('/favorites/toggle', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ buildingId: id })
  }).then(function(r) { return r.json(); }).then(function(data) {
    if (data.success) {
      if (data.favorited) {
        if (favorites.indexOf(id) === -1) {
          favorites.push(id);
        }
        btn.classList.add("active");
        btn.textContent = "♥";
        showToast("Saved to favorites ♥");
      } else {
        var idx = favorites.indexOf(id);
        if (idx !== -1) {
          favorites.splice(idx, 1);
        }
        btn.classList.remove("active");
        btn.textContent = "♡";
        showToast("Removed from favorites");
      }
      if (activeTab === "favorites") {
        applyAndRender();
      }
    }
  }).catch(function() { showToast("Could not update favorites."); });
}

function getFilteredListings() {
  var all = window.getBuildings();
  var results = [];

  for (var i = 0; i < all.length; i++) {
    var listing = all[i];

    if (activeTab === "favorites" && !isFavorited(listing._id || listing.id)) {
      continue;
    }

    if (filters.city !== "") {
      if (listing.city.toLowerCase().indexOf(filters.city.toLowerCase()) === -1) {
        continue;
      }
    }
    if (filters.zip !== "") {
      if (listing.zip.indexOf(filters.zip) === -1) {
        continue;
      }
    }
    if (filters.minPrice !== "") {
      if (listing.price < parseInt(filters.minPrice)) {
        continue;
      }
    }
    if (filters.maxPrice !== "") {
      if (listing.price > parseInt(filters.maxPrice)) {
        continue;
      }
    }
    if (filters.beds !== null) {
      if (filters.beds === 4) {
        if (listing.beds < 4) {
          continue;
        }
      } else {
        if (listing.beds !== filters.beds) {
          continue;
        }
      }
    }
    if (filters.amenities.length > 0) {
      var hasAll = true;
      for (var j = 0; j < filters.amenities.length; j++) {
        var found = false;
        var ams = listing.amenities || [];
        for (var k = 0; k < ams.length; k++) {
          if (ams[k] === filters.amenities[j]) {
            found = true;
            break;
          }
        }
        if (!found) {
          hasAll = false;
          break;
        }
      }
      if (!hasAll) {
        continue;
      }
    }

    results.push(listing);
  }
  return results;
}

function buildCard(listing) {
  var listingId = listing._id || String(listing.id);

  var card = document.createElement("div");
  card.className = "listing-card";
  card.addEventListener("click", function() {
    window.location.href = "/buildings/" + listingId;
  });

  var imgWrap = document.createElement("div");
  imgWrap.className = "listing-img";

  if (listing.lat && listing.lng) {
    var mapId = "mini-map-" + listingId;
    var mapDiv = document.createElement("div");
    mapDiv.className = "mini-map";
    mapDiv.id = mapId;
    imgWrap.appendChild(mapDiv);
    pendingMiniMaps.push({ id: mapId, lat: listing.lat, lng: listing.lng });
  } else {
    var placeholder = document.createElement("div");
    placeholder.className = "img-placeholder";
    placeholder.innerHTML = '<span class="icon">🏢</span><span>' + listing.name + '</span>';
    imgWrap.appendChild(placeholder);
  }

  if (listing.badge) {
    var badge = document.createElement("span");
    badge.className = "listing-badge";
    badge.textContent = listing.badge;
    imgWrap.appendChild(badge);
  }

  var favBtn = document.createElement("button");
  favBtn.className = "fav-btn" + (isFavorited(listingId) ? " active" : "");
  favBtn.textContent = isFavorited(listingId) ? "♥" : "♡";
  favBtn.title = "Save to favorites";
  favBtn.addEventListener("click", function(e) {
    e.stopPropagation();
    toggleFavorite(listingId, favBtn);
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
  location.textContent = "📍 " + listing.city + ", " + (listing.state || "NY") + " " + listing.zip;

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

  return card;
}

function initPendingMaps() {
  var queue = pendingMiniMaps.slice();
  pendingMiniMaps = [];
  setTimeout(function() {
    for (var i = 0; i < queue.length; i++) {
      var item = queue[i];
      var el = document.getElementById(item.id);
      if (!el) {
        continue;
      }
      var m = L.map(el, {
        center:           [item.lat, item.lng],
        zoom:             15,
        zoomControl:      false,
        scrollWheelZoom:  false,
        dragging:         false,
        touchZoom:        false,
        doubleClickZoom:  false,
        boxZoom:          false,
        keyboard:         false,
        attributionControl: false
      });
      L.tileLayer("https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png", {
        maxZoom: 19
      }).addTo(m);
      var icon = L.divIcon({ className: "mini-map-marker", iconSize: [10, 10], iconAnchor: [5, 5] });
      L.marker([item.lat, item.lng], { icon: icon, interactive: false }).addTo(m);
      miniMaps.push(m);
    }
  }, 0);
}

function renderListings(listings, totalCount) {
  var grid = document.getElementById("listingsGrid");
  if (!grid) {
    return;
  }

  for (var d = 0; d < miniMaps.length; d++) {
    miniMaps[d].remove();
  }
  miniMaps = [];
  pendingMiniMaps = [];
  grid.innerHTML = "";

  var total   = totalCount !== undefined ? totalCount : listings.length;
  var countEl = document.getElementById("listingsCount");
  if (countEl) {
    countEl.innerHTML = "<strong>" + total + "</strong> rentals found";
  }

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

  initPendingMaps();
}

function applyAndRender() {
  var all = getFilteredListings();

  if (currentSort === "price-asc") {
    all.sort(function(a, b) { return a.price - b.price; });
  } else if (currentSort === "price-desc") {
    all.sort(function(a, b) { return b.price - a.price; });
  } else if (currentSort === "sqft-desc") {
    all.sort(function(a, b) { return b.sqft - a.sqft; });
  } else if (currentSort === "trust-desc") {
    all.sort(function(a, b) { return (b.trustScore || 0) - (a.trustScore || 0); });
  }

  var totalPages = Math.ceil(all.length / PAGE_SIZE) || 1;
  if (currentPage > totalPages) {
    currentPage = totalPages;
  }
  var start = (currentPage - 1) * PAGE_SIZE;
  var page  = [];
  for (var i = start; i < start + PAGE_SIZE && i < all.length; i++) {
    page.push(all[i]);
  }
  renderListings(page, all.length);
  renderPagination(all.length);
  if (leafletMap) {
    updateMapPins(all);
  }
}

function renderPagination(totalCount) {
  var container = document.getElementById('pagination');
  if (!container) {
    return;
  }
  container.innerHTML = '';

  var totalPages = Math.ceil(totalCount / PAGE_SIZE) || 1;
  if (totalPages <= 1) {
    return;
  }

  var prevBtn = document.createElement('button');
  prevBtn.className = 'page-btn';
  prevBtn.textContent = '← Prev';
  if (currentPage === 1) {
    prevBtn.disabled = true;
  }
  prevBtn.addEventListener('click', function() {
    if (currentPage > 1) {
      currentPage--;
      applyAndRender();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  });
  container.appendChild(prevBtn);

  var maxButtons = 7;
  var half = Math.floor(maxButtons / 2);
  var startPage = currentPage - half;
  var endPage   = currentPage + half;
  if (startPage < 1) {
    startPage = 1;
    endPage   = Math.min(maxButtons, totalPages);
  }
  if (endPage > totalPages) {
    endPage   = totalPages;
    startPage = Math.max(1, totalPages - maxButtons + 1);
  }

  for (var p = startPage; p <= endPage; p++) {
    var pageBtn = document.createElement('button');
    pageBtn.className = 'page-btn';
    pageBtn.textContent = String(p);
    if (p === currentPage) {
      pageBtn.classList.add('active');
    }
    (function(pageNum) {
      pageBtn.addEventListener('click', function() {
        currentPage = pageNum;
        applyAndRender();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    })(p);
    container.appendChild(pageBtn);
  }

  var nextBtn = document.createElement('button');
  nextBtn.className = 'page-btn';
  nextBtn.textContent = 'Next →';
  if (currentPage === totalPages) {
    nextBtn.disabled = true;
  }
  nextBtn.addEventListener('click', function() {
    if (currentPage < totalPages) {
      currentPage++;
      applyAndRender();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  });
  container.appendChild(nextBtn);
}

function readFilters() {
  var cityEl = document.getElementById("filterCity");
  if (cityEl) {
    filters.city = cityEl.value.trim();
  }
  var zipEl = document.getElementById("filterZip");
  if (zipEl) {
    filters.zip = zipEl.value.trim();
  }
  var minEl = document.getElementById("filterMinPrice");
  if (minEl) {
    filters.minPrice = minEl.value.trim();
  }
  var maxEl = document.getElementById("filterMaxPrice");
  if (maxEl) {
    filters.maxPrice = maxEl.value.trim();
  }

  filters.amenities = [];
  var boxes = document.querySelectorAll(".amenity-check:checked");
  for (var i = 0; i < boxes.length; i++) {
    filters.amenities.push(boxes[i].value);
  }
}

function resetFilters() {
  filters = { city: "", zip: "", minPrice: "", maxPrice: "", beds: null, amenities: [] };

  var ids = ["filterCity", "filterZip", "filterMinPrice", "filterMaxPrice"];
  for (var i = 0; i < ids.length; i++) {
    var el = document.getElementById(ids[i]);
    if (el) {
      el.value = "";
    }
  }
  var bedBtns = document.querySelectorAll(".bed-btn");
  for (var j = 0; j < bedBtns.length; j++) {
    bedBtns[j].classList.remove("active");
  }
  var boxes = document.querySelectorAll(".amenity-check");
  for (var k = 0; k < boxes.length; k++) {
    boxes[k].checked = false;
  }

  applyAndRender();
}

function checkSearchParam() {
  var params = new URLSearchParams(window.location.search);
  var search = params.get("search");
  if (search) {
    var cityEl = document.getElementById("filterCity");
    if (cityEl) {
      cityEl.value = search;
    }
    filters.city = search;
  }

  var maxPrice = params.get("maxPrice");
  if (maxPrice) {
    filters.maxPrice = maxPrice;
    var maxEl = document.getElementById("filterMaxPrice");
    if (maxEl) {
      maxEl.value = maxPrice;
    }
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

//Leaflet map

function initMap() {
  if (leafletMap) {
    return;
  }
  leafletMap = L.map("buildingsMap", { attributionControl: false }).setView([40.74, -74.03], 11);
  L.tileLayer("https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png", {
    maxZoom: 19
  }).addTo(leafletMap);
}

function updateMapPins(listings) {
  for (var i = 0; i < mapMarkers.length; i++) {
    mapMarkers[i].remove();
  }
  mapMarkers = [];

  for (var j = 0; j < listings.length; j++) {
    var b = listings[j];
    if (!b.lat || !b.lng) {
      continue;
    }

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
      '<span style="color:#888;font-size:0.82rem;">' + b.city + ', ' + (b.state || 'NY') + '</span><br>' +
      '<span style="color:#f0a03c;font-weight:700;font-size:1rem;">$' + b.price.toLocaleString() + '/mo</span><br>' +
      '<a href="/buildings/' + (b._id || b.id) + '" style="color:#f0a03c;font-size:0.82rem;">View Details →</a>' +
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
  if (!toast) {
    return;
  }
  toast.textContent = message;
  toast.classList.add("show");
  setTimeout(function() { toast.classList.remove("show"); }, 2800);
}

function init() {
  loadFavorites();
  checkSearchParam();
  applyAndRender();

  var tabBtns = document.querySelectorAll(".tab-btn");
  for (var i = 0; i < tabBtns.length; i++) {
    tabBtns[i].addEventListener("click", function() {
      for (var j = 0; j < tabBtns.length; j++) {
        tabBtns[j].classList.remove("active");
      }
      this.classList.add("active");
      activeTab   = this.getAttribute("data-tab");
      currentPage = 1;
      applyAndRender();
    });
  }

  var bedBtns = document.querySelectorAll(".bed-btn");
  for (var i = 0; i < bedBtns.length; i++) {
    bedBtns[i].addEventListener("click", function() {
      var val = parseInt(this.getAttribute("data-beds"));
      if (filters.beds === val) {
        filters.beds = null;
        this.classList.remove("active");
      } else {
        filters.beds = val;
        for (var j = 0; j < bedBtns.length; j++) {
          bedBtns[j].classList.remove("active");
        }
        this.classList.add("active");
      }
      currentPage = 1;
      applyAndRender();
    });
  }

  var liveInputIds = ["filterCity", "filterZip", "filterMinPrice", "filterMaxPrice"];
  for (var li = 0; li < liveInputIds.length; li++) {
    var liveEl = document.getElementById(liveInputIds[li]);
    if (liveEl) {
      liveEl.addEventListener("input", function() {
        currentPage = 1;
        readFilters();
        applyAndRender();
      });
    }
  }

  var applyBtn = document.getElementById("applyFilters");
  if (applyBtn) {
    applyBtn.addEventListener("click", function() {
      currentPage = 1;
      readFilters();
      applyAndRender();
    });
  }

  var resetBtn = document.getElementById("resetFilters");
  if (resetBtn) {
    resetBtn.addEventListener("click", resetFilters);
  }

  var sortSelect = document.getElementById("sortSelect");
  if (sortSelect) {
    sortSelect.addEventListener("change", function() {
      currentSort = this.value;
      currentPage = 1;
      applyAndRender();
    });
  }

  var viewGridBtn = document.getElementById("viewGrid");
  var viewMapBtn  = document.getElementById("viewMap");
  if (viewGridBtn) {
    viewGridBtn.addEventListener("click", switchToGridView);
  }
  if (viewMapBtn) {
    viewMapBtn.addEventListener("click", switchToMapView);
  }
}

document.addEventListener("DOMContentLoaded", init);
