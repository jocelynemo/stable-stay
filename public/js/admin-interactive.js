//admin-interactive.js

function adminToast(msg) {
  var t = document.getElementById('toast');
  if (!t) {
    return;
  }
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(function() { t.classList.remove('show'); }, 2800);
}

// ── Tab switching ─────────────────────────────────────────────────────────────

var adminNavLinks = document.querySelectorAll('.admin-nav-link');
for (var i = 0; i < adminNavLinks.length; i++) {
  adminNavLinks[i].addEventListener('click', function(e) {
    e.preventDefault();
    var tab      = this.getAttribute('data-tab');
    var sections = document.querySelectorAll('.admin-section');
    for (var j = 0; j < sections.length; j++) {
      sections[j].classList.remove('active');
    }
    for (var k = 0; k < adminNavLinks.length; k++) {
      adminNavLinks[k].classList.remove('active');
    }
    var sec = document.getElementById(tab);
    if (sec) {
      sec.classList.add('active');
    }
    this.classList.add('active');
  });
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function makeTable(headers, rows) {
  var wrap = document.createElement('div');
  wrap.style.overflowX = 'auto';

  var table = document.createElement('table');
  table.className = 'admin-table';

  var thead = document.createElement('thead');
  var headerRow = document.createElement('tr');
  for (var i = 0; i < headers.length; i++) {
    var th = document.createElement('th');
    th.textContent = headers[i];
    headerRow.appendChild(th);
  }
  thead.appendChild(headerRow);
  table.appendChild(thead);

  var tbody = document.createElement('tbody');
  for (var i = 0; i < rows.length; i++) {
    tbody.appendChild(rows[i]);
  }
  table.appendChild(tbody);
  wrap.appendChild(table);
  return wrap;
}

function emptyState(msg) {
  var p = document.createElement('p');
  p.style.color     = 'var(--text-muted)';
  p.style.padding   = '24px 0';
  p.style.fontSize  = '0.9rem';
  p.textContent     = msg;
  return p;
}

function td(text) {
  var cell = document.createElement('td');
  cell.textContent = String(text || '');
  return cell;
}

function actionsTd(buttons) {
  var cell = document.createElement('td');
  cell.style.display    = 'flex';
  cell.style.gap        = '8px';
  cell.style.flexWrap   = 'wrap';
  for (var i = 0; i < buttons.length; i++) {
    cell.appendChild(buttons[i]);
  }
  return cell;
}

function deleteBtn(label, cls) {
  var btn = document.createElement('button');
  btn.className  = 'btn btn-ghost admin-del-btn';
  btn.style.fontSize  = '0.78rem';
  btn.style.padding   = '4px 10px';
  btn.style.color     = 'var(--danger)';
  btn.textContent     = label || 'Delete';
  if (cls) {
    btn.className += ' ' + cls;
  }
  return btn;
}

function smallBtn(label, color) {
  var btn = document.createElement('button');
  btn.className       = 'btn btn-ghost admin-action-btn';
  btn.style.fontSize  = '0.78rem';
  btn.style.padding   = '4px 10px';
  if (color) {
    btn.style.color = color;
  }
  btn.textContent = label;
  return btn;
}

// ── Overview ──────────────────────────────────────────────────────────────────

function renderOverview() {
  var grid = document.getElementById('overviewStats');
  if (!grid) {
    return;
  }

  var buildings  = window.ADMIN_BUILDINGS  || [];
  var users      = window.ADMIN_USERS      || [];
  var comments   = window.ADMIN_COMMENTS   || [];
  var issues     = window.ADMIN_ISSUES     || [];
  var violations = window.ADMIN_VIOLATIONS || [];

  var openViolations = 0;
  for (var i = 0; i < violations.length; i++) {
    if (violations[i].status === 'Open') {
      openViolations++;
    }
  }

  var reviews = window.ADMIN_REVIEWS || [];

  var stats = [
    { label: 'Buildings',       value: buildings.length },
    { label: 'Users',           value: users.length },
    { label: 'Reviews',         value: reviews.length },
    { label: 'Comments',        value: comments.length },
    { label: 'Issues Reported', value: issues.length },
    { label: 'Open Violations', value: openViolations }
  ];

  for (var i = 0; i < stats.length; i++) {
    var card = document.createElement('div');
    card.className = 'stat-card';
    card.innerHTML =
      '<div class="stat-value">' + stats[i].value + '</div>' +
      '<div class="stat-label">' + stats[i].label + '</div>';
    grid.appendChild(card);
  }
}

// ── Buildings table ───────────────────────────────────────────────────────────

function renderBuildings() {
  var wrap = document.getElementById('buildingsTableWrap');
  if (!wrap) {
    return;
  }
  var buildings = window.ADMIN_BUILDINGS || [];
  if (buildings.length === 0) {
    wrap.appendChild(emptyState('No buildings found.'));
    return;
  }

  var rows = [];
  for (var i = 0; i < buildings.length; i++) {
    var b   = buildings[i];
    var row = document.createElement('tr');

    var delBtn = deleteBtn('Delete');
    delBtn.setAttribute('data-id', b._id);
    (function(btn, r) {
      btn.addEventListener('click', async function() {
        if (!confirm('Delete this building and all its data?')) {
          return;
        }
        try {
          var res  = await fetch('/admin/buildings/' + btn.getAttribute('data-id'), { method: 'DELETE' });
          var data = await res.json();
          if (data.success) {
            adminToast('Building deleted.');
            r.remove();
          } else {
            adminToast(data.error || 'Error.');
          }
        } catch(e) {
          adminToast('Error deleting building.');
        }
      });
    })(delBtn, row);

    row.appendChild(td(b.name));
    row.appendChild(td(b.city));
    row.appendChild(td('$' + (b.price || 0).toLocaleString() + '/mo'));
    row.appendChild(td(b.beds + 'bd / ' + b.baths + 'ba'));
    row.appendChild(td(b.trustScore));
    row.appendChild(td(b.violationCount));
    row.appendChild(actionsTd([delBtn]));
    rows.push(row);
  }

  wrap.appendChild(makeTable(['Name', 'City', 'Price', 'Size', 'Trust', 'Violations', ''], rows));
}

// ── Reviews table ─────────────────────────────────────────────────────────────

function renderReviews() {
  var wrap = document.getElementById('reviewsTableWrap');
  if (!wrap) {
    return;
  }
  var reviews   = window.ADMIN_REVIEWS   || [];
  var buildings = window.ADMIN_BUILDINGS || [];

  var buildingMap = {};
  for (var i = 0; i < buildings.length; i++) {
    buildingMap[buildings[i]._id] = buildings[i].name;
  }

  if (reviews.length === 0) {
    wrap.appendChild(emptyState('No reviews yet.'));
    return;
  }

  var rows = [];
  for (var i = 0; i < reviews.length; i++) {
    var r   = reviews[i];
    var row = document.createElement('tr');

    var delBtn = deleteBtn('Delete');
    delBtn.setAttribute('data-id', r._id);
    (function(btn, tr) {
      btn.addEventListener('click', async function() {
        if (!confirm('Delete this review?')) {
          return;
        }
        try {
          var res  = await fetch('/admin/reviews/' + btn.getAttribute('data-id'), { method: 'DELETE' });
          var data = await res.json();
          if (data.success) {
            adminToast('Review deleted.');
            tr.remove();
          } else {
            adminToast(data.error || 'Error.');
          }
        } catch(e) {
          adminToast('Error.');
        }
      });
    })(delBtn, row);

    row.appendChild(td(buildingMap[r.buildingId] || r.buildingId));
    row.appendChild(td(r.displayName));
    row.appendChild(td(r.rating + ' ★'));
    row.appendChild(td(r.text));
    row.appendChild(actionsTd([delBtn]));
    rows.push(row);
  }

  wrap.appendChild(makeTable(['Building', 'User', 'Rating', 'Review', ''], rows));
}

// ── Comments table ────────────────────────────────────────────────────────────

function renderComments() {
  var wrap = document.getElementById('commentsTableWrap');
  if (!wrap) {
    return;
  }
  var comments  = window.ADMIN_COMMENTS  || [];
  var buildings = window.ADMIN_BUILDINGS || [];

  var buildingMap = {};
  for (var i = 0; i < buildings.length; i++) {
    buildingMap[buildings[i]._id] = buildings[i].name;
  }

  if (comments.length === 0) {
    wrap.appendChild(emptyState('No comments yet.'));
    return;
  }

  var rows = [];
  for (var i = 0; i < comments.length; i++) {
    var c   = comments[i];
    var row = document.createElement('tr');

    var delBtn = deleteBtn('Delete');
    delBtn.setAttribute('data-id', c._id);
    (function(btn, tr) {
      btn.addEventListener('click', async function() {
        if (!confirm('Delete this comment?')) {
          return;
        }
        try {
          var res  = await fetch('/admin/comments/' + btn.getAttribute('data-id'), { method: 'DELETE' });
          var data = await res.json();
          if (data.success) {
            adminToast('Comment deleted.');
            tr.remove();
          } else {
            adminToast(data.error || 'Error.');
          }
        } catch(e) {
          adminToast('Error.');
        }
      });
    })(delBtn, row);

    row.appendChild(td(buildingMap[c.buildingId] || c.buildingId));
    row.appendChild(td(c.displayName));
    row.appendChild(td(c.text));
    row.appendChild(actionsTd([delBtn]));
    rows.push(row);
  }

  wrap.appendChild(makeTable(['Building', 'User', 'Comment', ''], rows));
}

// ── Users table ───────────────────────────────────────────────────────────────

function renderUsers() {
  var wrap = document.getElementById('usersTableWrap');
  if (!wrap) {
    return;
  }
  var users = window.ADMIN_USERS || [];
  if (users.length === 0) {
    wrap.appendChild(emptyState('No users yet.'));
    return;
  }

  var rows = [];
  for (var i = 0; i < users.length; i++) {
    var u   = users[i];
    var row = document.createElement('tr');

    if (u.isAdmin) {
      row.appendChild(td(u.firstName + ' ' + u.lastName));
      row.appendChild(td(u.email));
      row.appendChild(td('Admin'));
      row.appendChild(td('—'));
      rows.push(row);
      continue;
    }

    var delBtn = deleteBtn('Remove');
    delBtn.setAttribute('data-id', u._id);
    (function(btn, tr) {
      btn.addEventListener('click', async function() {
        if (!confirm('Remove this user?')) {
          return;
        }
        try {
          var res  = await fetch('/admin/users/' + btn.getAttribute('data-id'), { method: 'DELETE' });
          var data = await res.json();
          if (data.success) {
            adminToast('User removed.');
            tr.remove();
          } else {
            adminToast(data.error || 'Error.');
          }
        } catch(e) {
          adminToast('Error.');
        }
      });
    })(delBtn, row);

    row.appendChild(td(u.firstName + ' ' + u.lastName));
    row.appendChild(td(u.email));
    row.appendChild(td('User'));
    row.appendChild(actionsTd([delBtn]));
    rows.push(row);
  }

  wrap.appendChild(makeTable(['Name', 'Email', 'Role', ''], rows));
}

// ── Violations table ──────────────────────────────────────────────────────────

function renderViolations() {
  var wrap = document.getElementById('violationsTableWrap');
  if (!wrap) {
    return;
  }
  var violations = window.ADMIN_VIOLATIONS || [];
  if (violations.length === 0) {
    wrap.appendChild(emptyState('No violations recorded.'));
    return;
  }

  var rows = [];
  for (var i = 0; i < violations.length; i++) {
    var v   = violations[i];
    var row = document.createElement('tr');

    var toggleBtn = smallBtn(v.status === 'Open' ? 'Mark Closed' : 'Mark Open', v.status === 'Open' ? 'var(--accent)' : 'var(--text-muted)');
    var delBtn    = deleteBtn('Delete');

    toggleBtn.setAttribute('data-bid', v.buildingId);
    toggleBtn.setAttribute('data-vid', v.vId || '');
    toggleBtn.setAttribute('data-status', v.status);

    delBtn.setAttribute('data-bid', v.buildingId);
    delBtn.setAttribute('data-vid', v.vId || '');

    (function(btn, statusCell) {
      btn.addEventListener('click', async function() {
        var bid       = btn.getAttribute('data-bid');
        var vid       = btn.getAttribute('data-vid');
        var curStatus = btn.getAttribute('data-status');
        var newStatus = curStatus === 'Open' ? 'Closed' : 'Open';
        try {
          var res  = await fetch('/admin/violations/' + bid + '/' + vid + '/status', {
            method:  'POST',
            headers: { 'Content-Type': 'application/json' },
            body:    JSON.stringify({ status: newStatus })
          });
          var data = await res.json();
          if (data.success) {
            btn.setAttribute('data-status', newStatus);
            btn.textContent = newStatus === 'Open' ? 'Mark Closed' : 'Mark Open';
            btn.style.color = newStatus === 'Open' ? 'var(--accent)' : 'var(--text-muted)';
            statusCell.textContent = newStatus;
            adminToast('Status updated to ' + newStatus + '.');
          } else {
            adminToast(data.error || 'Error.');
          }
        } catch(e) {
          adminToast('Error updating violation.');
        }
      });
    })(toggleBtn, row.cells ? row.cells[5] : null);

    (function(btn, r) {
      btn.addEventListener('click', async function() {
        if (!confirm('Delete this violation?')) {
          return;
        }
        var bid = btn.getAttribute('data-bid');
        var vid = btn.getAttribute('data-vid');
        try {
          var res  = await fetch('/admin/violations/' + bid + '/' + vid, { method: 'DELETE' });
          var data = await res.json();
          if (data.success) {
            adminToast('Violation deleted.');
            r.remove();
          } else {
            adminToast(data.error || 'Error.');
          }
        } catch(e) {
          adminToast('Error deleting violation.');
        }
      });
    })(delBtn, row);

    row.appendChild(td(v.buildingName));
    row.appendChild(td(v.date));
    row.appendChild(td(v.code));
    row.appendChild(td(v.description));
    row.appendChild(td(v.severity));
    row.appendChild(td(v.status));
    row.appendChild(actionsTd([toggleBtn, delBtn]));
    rows.push(row);
  }

  wrap.appendChild(makeTable(['Building', 'Date', 'Code', 'Description', 'Severity', 'Status', ''], rows));
}

// ── Issues table ──────────────────────────────────────────────────────────────

function renderIssues() {
  var wrap = document.getElementById('issuesTableWrap');
  if (!wrap) {
    return;
  }
  var issues    = window.ADMIN_ISSUES    || [];
  var buildings = window.ADMIN_BUILDINGS || [];

  var buildingMap = {};
  for (var i = 0; i < buildings.length; i++) {
    buildingMap[buildings[i]._id] = buildings[i].name;
  }

  if (issues.length === 0) {
    wrap.appendChild(emptyState('No issues reported.'));
    return;
  }

  var rows = [];
  for (var i = 0; i < issues.length; i++) {
    var iss = issues[i];
    var row = document.createElement('tr');

    var delBtn = deleteBtn('Delete');
    delBtn.setAttribute('data-id', iss._id);
    (function(btn, tr) {
      btn.addEventListener('click', async function() {
        if (!confirm('Delete this issue report?')) {
          return;
        }
        try {
          var res  = await fetch('/admin/issues/' + btn.getAttribute('data-id'), { method: 'DELETE' });
          var data = await res.json();
          if (data.success) {
            adminToast('Issue deleted.');
            tr.remove();
          } else {
            adminToast(data.error || 'Error.');
          }
        } catch(e) {
          adminToast('Error deleting issue.');
        }
      });
    })(delBtn, row);

    var dateStr = '';
    if (iss.createdAt) {
      dateStr = new Date(iss.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
    }

    row.appendChild(td(buildingMap[iss.buildingId] || iss.buildingId));
    row.appendChild(td(iss.displayName));
    row.appendChild(td(iss.type));
    row.appendChild(td(iss.description));
    row.appendChild(td(dateStr));
    row.appendChild(actionsTd([delBtn]));
    rows.push(row);
  }

  wrap.appendChild(makeTable(['Building', 'Reported By', 'Type', 'Description', 'Date', ''], rows));
}

// ── Add Building modal ────────────────────────────────────────────────────────

var addBuildingBtn  = document.getElementById('addBuildingBtn');
var addBuildingModal = document.getElementById('addBuildingModal');
var closeAddBuilding = document.getElementById('closeAddBuilding');

if (addBuildingBtn) {
  addBuildingBtn.addEventListener('click', function() {
    addBuildingModal.classList.add('open');
  });
}
if (closeAddBuilding) {
  closeAddBuilding.addEventListener('click', function() {
    addBuildingModal.classList.remove('open');
  });
}
if (addBuildingModal) {
  addBuildingModal.addEventListener('click', function(e) {
    if (e.target === addBuildingModal) {
      addBuildingModal.classList.remove('open');
    }
  });
}

var submitAddBuilding = document.getElementById('submitAddBuilding');
if (submitAddBuilding) {
  submitAddBuilding.addEventListener('click', async function() {
    var errEl = document.getElementById('addBuildingError');
    errEl.style.display = 'none';

    var name = document.getElementById('ab_name').value.trim();
    var city = document.getElementById('ab_city').value.trim();
    if (!name) {
      errEl.textContent = 'Building name is required.';
      errEl.style.display = 'block';
      return;
    }
    if (!city) {
      errEl.textContent = 'City is required.';
      errEl.style.display = 'block';
      return;
    }

    var amenities    = [];
    var amenityBoxes = document.querySelectorAll('.ab_amenity:checked');
    for (var i = 0; i < amenityBoxes.length; i++) {
      amenities.push(amenityBoxes[i].value);
    }

    var payload = {
      name,
      address:        document.getElementById('ab_address').value.trim(),
      city,
      zip:            document.getElementById('ab_zip').value.trim(),
      price:          document.getElementById('ab_price').value,
      units:          document.getElementById('ab_units').value,
      beds:           document.getElementById('ab_beds').value,
      baths:          document.getElementById('ab_baths').value,
      sqft:           document.getElementById('ab_sqft').value,
      borough:        document.getElementById('ab_borough').value.trim(),
      block:          document.getElementById('ab_block').value.trim(),
      lot:            document.getElementById('ab_lot').value.trim(),
      lat:            document.getElementById('ab_lat').value,
      lng:            document.getElementById('ab_lng').value,
      badge:          document.getElementById('ab_badge').value || null,
      rentStabilized: document.getElementById('ab_rentStab').value === 'true',
      amenities
    };

    try {
      var res  = await fetch('/admin/buildings', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(payload)
      });
      var data = await res.json();
      if (data.success) {
        adminToast('Building added!');
        addBuildingModal.classList.remove('open');
        window.location.reload();
      } else {
        errEl.textContent = data.error;
        errEl.style.display = 'block';
      }
    } catch(e) {
      errEl.textContent = 'Error adding building.';
      errEl.style.display = 'block';
    }
  });
}

// ── Add Violation modal ───────────────────────────────────────────────────────

var addViolationBtn   = document.getElementById('addViolationBtn');
var addViolationModal = document.getElementById('addViolationModal');
var closeAddViolation = document.getElementById('closeAddViolation');

function populateBuildingSelect() {
  var sel       = document.getElementById('av_buildingId');
  var buildings = window.ADMIN_BUILDINGS || [];
  if (!sel) {
    return;
  }
  sel.innerHTML = '';
  for (var i = 0; i < buildings.length; i++) {
    var opt = document.createElement('option');
    opt.value       = buildings[i]._id;
    opt.textContent = buildings[i].name + ' (' + buildings[i].city + ')';
    sel.appendChild(opt);
  }
}

if (addViolationBtn) {
  addViolationBtn.addEventListener('click', function() {
    populateBuildingSelect();
    var dateInput = document.getElementById('av_date');
    if (dateInput) {
      dateInput.value = new Date().toISOString().slice(0, 10);
    }
    addViolationModal.classList.add('open');
  });
}
if (closeAddViolation) {
  closeAddViolation.addEventListener('click', function() {
    addViolationModal.classList.remove('open');
  });
}
if (addViolationModal) {
  addViolationModal.addEventListener('click', function(e) {
    if (e.target === addViolationModal) {
      addViolationModal.classList.remove('open');
    }
  });
}

var submitAddViolation = document.getElementById('submitAddViolation');
if (submitAddViolation) {
  submitAddViolation.addEventListener('click', async function() {
    var errEl = document.getElementById('addViolationError');
    errEl.style.display = 'none';

    var buildingId  = document.getElementById('av_buildingId').value;
    var code        = document.getElementById('av_code').value.trim();
    var description = document.getElementById('av_description').value.trim();
    var severity    = document.getElementById('av_severity').value;
    var status      = document.getElementById('av_status').value;
    var date        = document.getElementById('av_date').value;

    if (!code) {
      errEl.textContent = 'Violation code is required.';
      errEl.style.display = 'block';
      return;
    }
    if (!description) {
      errEl.textContent = 'Description is required.';
      errEl.style.display = 'block';
      return;
    }

    try {
      var res  = await fetch('/admin/violations/' + buildingId, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ code, description, severity, status, date })
      });
      var data = await res.json();
      if (data.success) {
        adminToast('Violation added!');
        addViolationModal.classList.remove('open');
        window.location.reload();
      } else {
        errEl.textContent = data.error;
        errEl.style.display = 'block';
      }
    } catch(e) {
      errEl.textContent = 'Error adding violation.';
      errEl.style.display = 'block';
    }
  });
}

// ── Init ──────────────────────────────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', function() {
  renderOverview();
  renderBuildings();
  renderReviews();
  renderComments();
  renderUsers();
  renderViolations();
  renderIssues();
});
