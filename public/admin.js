// admin.js - admin dashboard logic

var ADMIN_EMAIL = "admin@stablestay.com";

// ── Guard ─────────────────────────────────────────────────────────────────────

function adminGuard() {
  var user = authGetCurrentUser();
  if (!user || !user.isAdmin) {
    window.location.href = "/";
    return false;
  }
  return true;
}

// ── Toast ─────────────────────────────────────────────────────────────────────

function adminToast(msg) {
  var t = document.getElementById("toast");
  if (!t) return;
  t.textContent = msg;
  t.classList.add("show");
  setTimeout(function() { t.classList.remove("show"); }, 2800);
}

// ── Tab switching ─────────────────────────────────────────────────────────────

function adminSwitchTab(tabId) {
  var sections = document.querySelectorAll(".admin-section");
  for (var i = 0; i < sections.length; i++) sections[i].classList.remove("active");
  var links = document.querySelectorAll(".admin-nav-link");
  for (var j = 0; j < links.length; j++) links[j].classList.remove("active");

  var target = document.getElementById(tabId);
  if (target) target.classList.add("active");

  var links2 = document.querySelectorAll(".admin-nav-link");
  for (var k = 0; k < links2.length; k++) {
    if (links2[k].getAttribute("data-tab") === tabId) links2[k].classList.add("active");
  }
}

// ── Overview stats ────────────────────────────────────────────────────────────

function renderOverview() {
  var buildings = window.getBuildings();
  var users = authGetUsers();

  // count reviews across all buildings
  var totalReviews = 0;
  var deletedReviews = JSON.parse(localStorage.getItem("adminDeletedReviews") || "[]");
  for (var i = 0; i < buildings.length; i++) {
    var userRevs = JSON.parse(localStorage.getItem("userReviews") || "{}");
    var baseRevs = buildings[i].reviews || [];
    var bid = buildings[i].id;
    var combined = baseRevs.concat(userRevs[bid] || []);
    for (var r = 0; r < combined.length; r++) {
      if (deletedReviews.indexOf(window.reviewKey(bid, combined[r])) === -1) totalReviews++;
    }
  }

  var stats = [
    { label: "Total Buildings", value: buildings.length, icon: "🏢" },
    { label: "Registered Users", value: users.length, icon: "👤" },
    { label: "Total Reviews", value: totalReviews, icon: "⭐" },
    { label: "Avg Trust Score", value: (function() {
        var sum = 0;
        for (var i = 0; i < buildings.length; i++) sum += (buildings[i].trustScore || 0);
        return buildings.length ? Math.round(sum / buildings.length) : 0;
      })(), icon: "🛡" }
  ];

  var grid = document.getElementById("overviewStats");
  if (!grid) return;
  grid.innerHTML = "";
  for (var s = 0; s < stats.length; s++) {
    var card = document.createElement("div");
    card.className = "stat-card";
    card.innerHTML =
      '<div class="stat-icon">' + stats[s].icon + '</div>' +
      '<div class="stat-value">' + stats[s].value + '</div>' +
      '<div class="stat-label">' + stats[s].label + '</div>';
    grid.appendChild(card);
  }
}

// ── Buildings table ───────────────────────────────────────────────────────────

function renderBuildings() {
  var buildings = window.getBuildings();
  var wrap = document.getElementById("buildingsTableWrap");
  if (!wrap) return;

  if (buildings.length === 0) {
    wrap.innerHTML = '<p class="empty-state">No buildings yet.</p>';
    return;
  }

  var html = '<div class="admin-table-wrap"><table class="admin-table"><thead><tr>' +
    '<th>Name</th><th>City</th><th>Price/mo</th><th>Trust</th><th>Units</th><th>Actions</th>' +
    '</tr></thead><tbody>';

  for (var i = 0; i < buildings.length; i++) {
    var b = buildings[i];
    html += '<tr>' +
      '<td><strong>' + b.name + '</strong><br><span style="font-size:0.8rem;color:var(--text-muted)">' + (b.address || "") + '</span></td>' +
      '<td>' + b.city + '</td>' +
      '<td>$' + (b.price || 0).toLocaleString() + '</td>' +
      '<td><span class="trust-pill ' + trustClass(b.trustScore) + '">' + (b.trustScore || "—") + '</span></td>' +
      '<td>' + (b.units || "—") + '</td>' +
      '<td class="admin-actions">' +
        '<button class="btn btn-ghost btn-sm" data-action="edit" data-id="' + b.id + '">Edit</button>' +
        '<button class="btn btn-danger btn-sm" data-action="delete" data-id="' + b.id + '">Delete</button>' +
      '</td></tr>';
  }
  html += '</tbody></table></div>';
  wrap.innerHTML = html;

  // wire edit/delete buttons
  var btns = wrap.querySelectorAll("button[data-action]");
  for (var j = 0; j < btns.length; j++) {
    btns[j].addEventListener("click", function() {
      var action = this.getAttribute("data-action");
      var id = parseInt(this.getAttribute("data-id"), 10);
      if (action === "delete") adminDeleteBuilding(id);
      else if (action === "edit") adminEditBuilding(id);
    });
  }
}

function trustClass(score) {
  if (score >= 85) return "trust-high";
  if (score >= 65) return "trust-mid";
  return "trust-low";
}

function adminDeleteBuilding(id) {
  if (!confirm("Delete this building? It will be hidden from all users.")) return;
  var hidden = JSON.parse(localStorage.getItem("adminHiddenBuildings") || "[]");
  if (hidden.indexOf(id) === -1) hidden.push(id);
  localStorage.setItem("adminHiddenBuildings", JSON.stringify(hidden));
  renderBuildings();
  renderOverview();
  adminToast("Building removed.");
}

function adminEditBuilding(id) {
  var buildings = window.getBuildings();
  var b = null;
  for (var i = 0; i < buildings.length; i++) {
    if (buildings[i].id === id) { b = buildings[i]; break; }
  }
  if (!b) return;

  var modal = document.getElementById("addBuildingModal");
  var title = modal.querySelector(".modal-title");
  title.textContent = "Edit Building";

  // pre-fill fields
  document.getElementById("ab_name").value    = b.name || "";
  document.getElementById("ab_address").value = b.address || "";
  document.getElementById("ab_city").value    = b.city || "";
  document.getElementById("ab_zip").value     = b.zip || "";
  document.getElementById("ab_price").value   = b.price || "";
  document.getElementById("ab_units").value   = b.units || "";
  document.getElementById("ab_beds").value    = b.beds || "";
  document.getElementById("ab_baths").value   = b.baths || "";
  document.getElementById("ab_sqft").value    = b.sqft || "";
  document.getElementById("ab_borough").value = b.borough || "";
  document.getElementById("ab_block").value   = b.block || "";
  document.getElementById("ab_lot").value     = b.lot || "";
  document.getElementById("ab_lat").value     = b.lat || "";
  document.getElementById("ab_lng").value     = b.lng || "";
  document.getElementById("ab_badge").value   = b.badge || "";
  document.getElementById("ab_rentStab").value = b.rentStabilized ? "true" : "false";

  var amenityBoxes = document.querySelectorAll(".ab_amenity");
  for (var j = 0; j < amenityBoxes.length; j++) {
    amenityBoxes[j].checked = (b.amenities || []).indexOf(amenityBoxes[j].value) !== -1;
  }

  // swap submit button behaviour
  var submitBtn = document.getElementById("submitAddBuilding");
  submitBtn.textContent = "Save Changes";
  submitBtn._editId = id;
  submitBtn._mode = "edit";

  modal.classList.add("open");
}

// ── Reviews table ─────────────────────────────────────────────────────────────

function renderReviews() {
  var buildings = window.getBuildings();
  var deletedKeys = JSON.parse(localStorage.getItem("adminDeletedReviews") || "[]");
  var userRevs = JSON.parse(localStorage.getItem("userReviews") || "{}");
  var wrap = document.getElementById("reviewsTableWrap");
  if (!wrap) return;

  var rows = "";
  for (var i = 0; i < buildings.length; i++) {
    var b = buildings[i];
    var combined = (b.reviews || []).concat(userRevs[b.id] || []);
    for (var r = 0; r < combined.length; r++) {
      var rev = combined[r];
      var key = window.reviewKey(b.id, rev);
      if (deletedKeys.indexOf(key) !== -1) continue;
      var stars = "";
      for (var s = 0; s < 5; s++) stars += s < rev.rating ? "★" : "☆";
      rows += '<tr>' +
        '<td><strong>' + b.name + '</strong></td>' +
        '<td>' + (rev.user || rev.displayName || "—") + '</td>' +
        '<td style="color:#f59e0b">' + stars + '</td>' +
        '<td>' + (rev.text ? rev.text.substring(0, 60) + (rev.text.length > 60 ? "…" : "") : '<em style="color:var(--text-muted)">No text</em>') + '</td>' +
        '<td>' + (rev.date || "") + '</td>' +
        '<td><button class="btn btn-danger btn-sm" data-rkey="' + key + '">Delete</button></td>' +
        '</tr>';
    }
  }

  if (!rows) {
    wrap.innerHTML = '<p class="empty-state">No reviews found.</p>';
    return;
  }

  wrap.innerHTML = '<div class="admin-table-wrap"><table class="admin-table"><thead><tr>' +
    '<th>Building</th><th>User</th><th>Stars</th><th>Review</th><th>Date</th><th>Action</th>' +
    '</tr></thead><tbody>' + rows + '</tbody></table></div>';

  var btns = wrap.querySelectorAll("button[data-rkey]");
  for (var k = 0; k < btns.length; k++) {
    btns[k].addEventListener("click", function() {
      var key2 = this.getAttribute("data-rkey");
      var del = JSON.parse(localStorage.getItem("adminDeletedReviews") || "[]");
      if (del.indexOf(key2) === -1) del.push(key2);
      localStorage.setItem("adminDeletedReviews", JSON.stringify(del));
      renderReviews();
      renderOverview();
      adminToast("Review deleted.");
    });
  }
}

// ── Comments table ────────────────────────────────────────────────────────────

function renderComments() {
  var buildings = window.getBuildings();
  var deletedKeys = JSON.parse(localStorage.getItem("adminDeletedComments") || "[]");
  var userComments = JSON.parse(localStorage.getItem("userComments") || "{}");
  var wrap = document.getElementById("commentsTableWrap");
  if (!wrap) return;

  var rows = "";
  for (var i = 0; i < buildings.length; i++) {
    var b = buildings[i];
    var combined = (b.comments || []).concat(userComments[b.id] || []);
    for (var c = 0; c < combined.length; c++) {
      var com = combined[c];
      var key = window.commentKey(b.id, com);
      if (deletedKeys.indexOf(key) !== -1) continue;
      rows += '<tr>' +
        '<td><strong>' + b.name + '</strong></td>' +
        '<td>' + (com.user || "—") + '</td>' +
        '<td>' + (com.text ? com.text.substring(0, 80) + (com.text.length > 80 ? "…" : "") : "") + '</td>' +
        '<td>' + (com.date || "") + '</td>' +
        '<td><button class="btn btn-danger btn-sm" data-ckey="' + key + '">Delete</button></td>' +
        '</tr>';
    }
  }

  if (!rows) {
    wrap.innerHTML = '<p class="empty-state">No comments found.</p>';
    return;
  }

  wrap.innerHTML = '<div class="admin-table-wrap"><table class="admin-table"><thead><tr>' +
    '<th>Building</th><th>User</th><th>Comment</th><th>Date</th><th>Action</th>' +
    '</tr></thead><tbody>' + rows + '</tbody></table></div>';

  var btns = wrap.querySelectorAll("button[data-ckey]");
  for (var k = 0; k < btns.length; k++) {
    btns[k].addEventListener("click", function() {
      var key2 = this.getAttribute("data-ckey");
      var del = JSON.parse(localStorage.getItem("adminDeletedComments") || "[]");
      if (del.indexOf(key2) === -1) del.push(key2);
      localStorage.setItem("adminDeletedComments", JSON.stringify(del));
      renderComments();
      adminToast("Comment deleted.");
    });
  }
}

// ── Users table ───────────────────────────────────────────────────────────────

function renderUsers() {
  var users = authGetUsers();
  var wrap = document.getElementById("usersTableWrap");
  if (!wrap) return;

  var rows = "";
  for (var i = 0; i < users.length; i++) {
    var u = users[i];
    if (u.email.toLowerCase() === ADMIN_EMAIL.toLowerCase()) continue;
    rows += '<tr>' +
      '<td>' + u.firstName + ' ' + u.lastName + '</td>' +
      '<td>' + u.email + '</td>' +
      '<td>' + (u.city || "—") + '</td>' +
      '<td>' + (u.state || "—") + '</td>' +
      '<td><button class="btn btn-danger btn-sm" data-email="' + u.email + '">Remove</button></td>' +
      '</tr>';
  }

  if (!rows) {
    wrap.innerHTML = '<p class="empty-state">No registered users yet.</p>';
    return;
  }

  wrap.innerHTML = '<div class="admin-table-wrap"><table class="admin-table"><thead><tr>' +
    '<th>Name</th><th>Email</th><th>City</th><th>State</th><th>Action</th>' +
    '</tr></thead><tbody>' + rows + '</tbody></table></div>';

  var btns = wrap.querySelectorAll("button[data-email]");
  for (var k = 0; k < btns.length; k++) {
    btns[k].addEventListener("click", function() {
      var email = this.getAttribute("data-email");
      if (!confirm("Remove user " + email + "?")) return;
      var allUsers = authGetUsers();
      var filtered = [];
      for (var m = 0; m < allUsers.length; m++) {
        if (allUsers[m].email.toLowerCase() !== email.toLowerCase()) filtered.push(allUsers[m]);
      }
      authSaveUsers(filtered);
      renderUsers();
      renderOverview();
      adminToast("User removed.");
    });
  }
}

// ── Add / Edit Building modal ─────────────────────────────────────────────────

function collectBuildingForm() {
  var amenities = [];
  var boxes = document.querySelectorAll(".ab_amenity:checked");
  for (var i = 0; i < boxes.length; i++) amenities.push(boxes[i].value);

  return {
    name:           document.getElementById("ab_name").value.trim(),
    address:        document.getElementById("ab_address").value.trim(),
    city:           document.getElementById("ab_city").value.trim(),
    zip:            document.getElementById("ab_zip").value.trim(),
    price:          parseFloat(document.getElementById("ab_price").value) || 0,
    units:          parseInt(document.getElementById("ab_units").value, 10) || 0,
    beds:           parseInt(document.getElementById("ab_beds").value, 10) || 0,
    baths:          parseInt(document.getElementById("ab_baths").value, 10) || 0,
    sqft:           parseInt(document.getElementById("ab_sqft").value, 10) || 0,
    borough:        document.getElementById("ab_borough").value.trim(),
    block:          document.getElementById("ab_block").value.trim(),
    lot:            document.getElementById("ab_lot").value.trim(),
    lat:            parseFloat(document.getElementById("ab_lat").value) || 0,
    lng:            parseFloat(document.getElementById("ab_lng").value) || 0,
    badge:          document.getElementById("ab_badge").value || null,
    rentStabilized: document.getElementById("ab_rentStab").value === "true",
    amenities:      amenities
  };
}

function resetBuildingForm() {
  var ids = ["ab_name","ab_address","ab_city","ab_zip","ab_price","ab_units",
             "ab_beds","ab_baths","ab_sqft","ab_borough","ab_block","ab_lot","ab_lat","ab_lng"];
  for (var i = 0; i < ids.length; i++) document.getElementById(ids[i]).value = "";
  document.getElementById("ab_badge").value = "";
  document.getElementById("ab_rentStab").value = "false";
  var boxes = document.querySelectorAll(".ab_amenity");
  for (var j = 0; j < boxes.length; j++) boxes[j].checked = false;

  var submitBtn = document.getElementById("submitAddBuilding");
  submitBtn.textContent = "Add Building";
  submitBtn._editId = null;
  submitBtn._mode = "add";

  var modal = document.getElementById("addBuildingModal");
  if (modal) modal.querySelector(".modal-title").textContent = "Add Building";

  var errEl = document.getElementById("addBuildingError");
  if (errEl) { errEl.style.display = "none"; errEl.textContent = ""; }
}

function openAddBuildingModal() {
  resetBuildingForm();
  document.getElementById("addBuildingModal").classList.add("open");
}

function closeAddBuildingModal() {
  document.getElementById("addBuildingModal").classList.remove("open");
}

function wireAddBuildingModal() {
  document.getElementById("addBuildingBtn").addEventListener("click", openAddBuildingModal);
  document.getElementById("closeAddBuilding").addEventListener("click", closeAddBuildingModal);

  document.getElementById("addBuildingModal").addEventListener("click", function(e) {
    if (e.target === this) closeAddBuildingModal();
  });

  document.getElementById("submitAddBuilding").addEventListener("click", function() {
    var data = collectBuildingForm();
    var errEl = document.getElementById("addBuildingError");
    errEl.style.display = "none";

    if (!data.name) {
      errEl.textContent = "Building name is required.";
      errEl.style.display = "block";
      return;
    }
    if (!data.city) {
      errEl.textContent = "City is required.";
      errEl.style.display = "block";
      return;
    }

    if (this._mode === "edit" && this._editId) {
      // save as edit override
      var edits = JSON.parse(localStorage.getItem("adminEditedBuildings") || "{}");
      edits[this._editId] = data;
      localStorage.setItem("adminEditedBuildings", JSON.stringify(edits));
      adminToast("Building updated.");
    } else {
      // new building
      var added = JSON.parse(localStorage.getItem("adminAddedBuildings") || "[]");
      data.id = Date.now();
      data.violations = [];
      data.reviews = [];
      data.reportedIssues = [];
      data.comments = [];
      data.trustScore = data.rentStabilized ? 90 : 75;
      data.violationCount = 0;
      data.avgRating = 0;
      added.push(data);
      localStorage.setItem("adminAddedBuildings", JSON.stringify(added));
      adminToast("Building added!");
    }

    closeAddBuildingModal();
    renderBuildings();
    renderOverview();
  });
}

// ── Init ──────────────────────────────────────────────────────────────────────

document.addEventListener("DOMContentLoaded", function() {
  if (!adminGuard()) return;

  // sidebar tab nav
  var navLinks = document.querySelectorAll(".admin-nav-link");
  for (var i = 0; i < navLinks.length; i++) {
    navLinks[i].addEventListener("click", function(e) {
      e.preventDefault();
      var tab = this.getAttribute("data-tab");
      adminSwitchTab(tab);
      if (tab === "tabOverview")   renderOverview();
      if (tab === "tabBuildings")  renderBuildings();
      if (tab === "tabReviews")    renderReviews();
      if (tab === "tabComments")   renderComments();
      if (tab === "tabUsers")      renderUsers();
    });
  }

  wireAddBuildingModal();

  // render default tab
  renderOverview();
});
