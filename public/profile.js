// profile.js - user profile page logic

// all listings (for favorites display)
const allListings = [
  { id: 1,  name: "The Meridian",         price: 2400, city: "Jersey City",  zip: "07302", beds: 2, baths: 1, sqft: 850,  badge: "New" },
  { id: 2,  name: "Riverside Lofts",       price: 1800, city: "Hoboken",      zip: "07030", beds: 1, baths: 1, sqft: 620,  badge: "Hot" },
  { id: 3,  name: "Union Square Apts",     price: 3100, city: "Union City",   zip: "07087", beds: 3, baths: 2, sqft: 1150, badge: null  },
  { id: 4,  name: "Harbor View Towers",    price: 2900, city: "Weehawken",    zip: "07086", beds: 2, baths: 2, sqft: 980,  badge: null  },
  { id: 5,  name: "Palisade Commons",      price: 1600, city: "North Bergen", zip: "07047", beds: 1, baths: 1, sqft: 570,  badge: "Deal" },
  { id: 6,  name: "Exchange Place Suites", price: 3400, city: "Jersey City",  zip: "07311", beds: 2, baths: 2, sqft: 1050, badge: "New" },
  { id: 7,  name: "Lincoln Park Arms",     price: 2200, city: "Jersey City",  zip: "07304", beds: 2, baths: 1, sqft: 870,  badge: null  },
  { id: 8,  name: "Bloomfield Flats",      price: 1500, city: "Bloomfield",   zip: "07003", beds: 1, baths: 1, sqft: 540,  badge: null  },
  { id: 9,  name: "Summit Ridge",          price: 2700, city: "Bayonne",      zip: "07002", beds: 3, baths: 2, sqft: 1200, badge: null  },
  { id: 10, name: "Metro East",            price: 1950, city: "Kearny",       zip: "07032", beds: 1, baths: 1, sqft: 680,  badge: null  }
];

let favorites = [];

function loadFavorites() {
  let stored = localStorage.getItem("favorites");
  if (stored !== null) favorites = JSON.parse(stored);
}

function isFavorited(id) {
  for (let i = 0; i < favorites.length; i++) {
    if (favorites[i] === id) return true;
  }
  return false;
}

function removeFavorite(id) {
  let newFavs = [];
  for (let i = 0; i < favorites.length; i++) {
    if (favorites[i] !== id) newFavs.push(favorites[i]);
  }
  favorites = newFavs;
  localStorage.setItem("favorites", JSON.stringify(favorites));
  renderFavorites();
  showToast("Removed from saved listings");
}

function populateProfile(user) {
  let set = function(id, val) {
    let el = document.getElementById(id);
    if (el !== null) el.value = val || "";
  };
  set("profileFirstName", user.firstName);
  set("profileLastName",  user.lastName);
  set("profileEmail",     user.email);
  set("profilePhone",     user.phone);
  set("profileCity",      user.city);
  set("profileState",     user.state);
  set("profileZip",       user.zip);

  let avatarEl = document.getElementById("avatarInitials");
  if (avatarEl !== null) {
    avatarEl.textContent = (user.firstName[0] || "") + (user.lastName[0] || "");
  }
  let nameEl = document.getElementById("profileDisplayName");
  if (nameEl !== null) nameEl.textContent = user.firstName + " " + user.lastName;

  let emailEl = document.getElementById("profileDisplayEmail");
  if (emailEl !== null) emailEl.textContent = user.email;
}

function buildFavCard(listing) {
  let card = document.createElement("div");
  card.className = "listing-card";

  let imgWrap = document.createElement("div");
  imgWrap.className = "listing-img";

  let placeholder = document.createElement("div");
  placeholder.className = "img-placeholder";
  placeholder.innerHTML = '<span class="icon">🏢</span><span>' + listing.name + '</span>';
  imgWrap.appendChild(placeholder);

  if (listing.badge !== null) {
    let badge = document.createElement("span");
    badge.className = "listing-badge";
    badge.textContent = listing.badge;
    imgWrap.appendChild(badge);
  }

  let removeBtn = document.createElement("button");
  removeBtn.className = "fav-btn active";
  removeBtn.textContent = "♥";
  removeBtn.title = "Remove from saved";
  removeBtn.addEventListener("click", function(e) {
    e.stopPropagation();
    removeFavorite(listing.id);
  });
  imgWrap.appendChild(removeBtn);
  card.appendChild(imgWrap);

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

  meta.appendChild(metaBeds);
  meta.appendChild(metaBaths);
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

function renderFavorites() {
  let grid = document.getElementById("favoritesGrid");
  if (grid === null) return;
  grid.innerHTML = "";

  let favListings = [];
  for (let i = 0; i < allListings.length; i++) {
    if (isFavorited(allListings[i].id)) favListings.push(allListings[i]);
  }

  if (favListings.length === 0) {
    let empty = document.createElement("div");
    empty.style.gridColumn = "1 / -1";
    empty.style.padding = "48px 0";
    empty.style.textAlign = "center";
    empty.style.color = "var(--text-muted)";
    empty.innerHTML = "No saved listings yet. <a href='/buildings' style='color:var(--accent)'>Browse rentals</a> to start saving.";
    grid.appendChild(empty);
    return;
  }

  for (let i = 0; i < favListings.length; i++) {
    grid.appendChild(buildFavCard(favListings[i]));
  }
}

function switchSection(sectionId) {
  let sections = document.querySelectorAll(".profile-section");
  for (let i = 0; i < sections.length; i++) {
    sections[i].classList.remove("active");
  }
  let target = document.getElementById(sectionId);
  if (target !== null) target.classList.add("active");

  let navLinks = document.querySelectorAll(".profile-nav li a");
  for (let i = 0; i < navLinks.length; i++) {
    navLinks[i].classList.remove("active");
    if (navLinks[i].getAttribute("data-section") === sectionId) {
      navLinks[i].classList.add("active");
    }
  }
}

function showToast(message) {
  let toast = document.getElementById("toast");
  if (toast === null) return;
  toast.textContent = message;
  toast.classList.add("show");
  setTimeout(function() { toast.classList.remove("show"); }, 2800);
}

function init() {
  // Redirect to home if not logged in
  let user = authGetCurrentUser();
  if (user === null) {
    window.location.href = "/";
    return;
  }

  loadFavorites();
  populateProfile(user);
  renderFavorites();

  // Sidebar nav
  let navLinks = document.querySelectorAll(".profile-nav li a");
  for (let i = 0; i < navLinks.length; i++) {
    navLinks[i].addEventListener("click", function(e) {
      e.preventDefault();
      switchSection(this.getAttribute("data-section"));
    });
  }

  // Save profile button
  let saveBtn = document.getElementById("saveProfile");
  if (saveBtn !== null) {
    saveBtn.addEventListener("click", function() {
      let updates = {
        firstName: document.getElementById("profileFirstName").value.trim(),
        lastName:  document.getElementById("profileLastName").value.trim(),
        phone:     document.getElementById("profilePhone").value.trim(),
        city:      document.getElementById("profileCity").value.trim(),
        state:     document.getElementById("profileState").value.trim(),
        zip:       document.getElementById("profileZip").value.trim()
      };
      if (!updates.firstName || !updates.lastName) {
        showToast("First and last name are required.");
        return;
      }
      authUpdateUserProfile(updates);
      // refresh display name
      let nameEl = document.getElementById("profileDisplayName");
      if (nameEl !== null) nameEl.textContent = updates.firstName + " " + updates.lastName;
      let avatarEl = document.getElementById("avatarInitials");
      if (avatarEl !== null) avatarEl.textContent = updates.firstName[0] + updates.lastName[0];
      showToast("Profile saved!");
    });
  }

  // Change password button
  let changePwBtn = document.getElementById("changePassword");
  if (changePwBtn !== null) {
    changePwBtn.addEventListener("click", function() {
      let current = document.getElementById("pwCurrent").value;
      let newPw   = document.getElementById("pwNew").value;
      let confirm = document.getElementById("pwConfirm").value;

      if (!current || !newPw || !confirm) {
        showToast("Please fill in all password fields.");
        return;
      }
      if (newPw !== confirm) {
        showToast("New passwords do not match.");
        return;
      }
      let result = authChangePassword(current, newPw);
      if (result.success) {
        document.getElementById("pwCurrent").value = "";
        document.getElementById("pwNew").value = "";
        document.getElementById("pwConfirm").value = "";
        showToast("Password updated successfully!");
      } else {
        showToast(result.error);
      }
    });
  }
}

document.addEventListener("DOMContentLoaded", init);
