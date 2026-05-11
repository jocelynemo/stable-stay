// building-interactive.js: Renders and handles interactions for the building detail page

function showToast(msg) {
  var t = document.getElementById('toast');
  if (!t) { return; }
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(function() { t.classList.remove('show'); }, 2800);
}

function starsHtml(rating) {
  var html = '';
  for (var i = 1; i <= 5; i++) {
    if (i <= rating) {
      html += '<span class="star filled">★</span>';
    } else {
      html += '<span class="star">★</span>';
    }
  }
  return html;
}

function formatDate(dateStr) {
  if (!dateStr) { return ''; }
  var d = new Date(dateStr);
  var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  return months[d.getMonth()] + ' ' + d.getDate() + ', ' + d.getFullYear();
}

// ── Hero ──────────────────────────────────────────────────────────────────────

function renderHero() {
  var hero = document.getElementById('buildingHero');
  if (!hero) { return; }
  var b = window.BUILDING_DATA;

  var top = document.createElement('div');
  top.className = 'building-hero-top';

  var left = document.createElement('div');

  var badges = document.createElement('div');
  badges.className = 'building-badges';
  if (b.badge) {
    var badgeEl = document.createElement('span');
    badgeEl.className = 'detail-badge badge-white';
    badgeEl.textContent = b.badge;
    badges.appendChild(badgeEl);
  }
  if (b.rentStabilized) {
    var stabEl = document.createElement('span');
    stabEl.className = 'detail-badge badge-green';
    stabEl.textContent = 'Rent Stabilized';
    badges.appendChild(stabEl);
  }
  left.appendChild(badges);

  var nameEl = document.createElement('div');
  nameEl.className = 'building-hero-name';
  nameEl.textContent = b.name;
  left.appendChild(nameEl);

  var addressEl = document.createElement('div');
  addressEl.className = 'building-hero-address';
  addressEl.textContent = '📍 ' + b.address + ', ' + b.city + ', ' + (b.state || 'NY') + ' ' + b.zip;
  left.appendChild(addressEl);

  var priceEl = document.createElement('div');
  priceEl.className = 'building-hero-price';
  priceEl.innerHTML = '$' + b.price.toLocaleString() + '<span>/mo</span>';
  left.appendChild(priceEl);

  top.appendChild(left);

  var actions = document.createElement('div');
  actions.className = 'building-hero-actions';

  var favBtn = document.createElement('button');
  favBtn.id = 'favBtn';
  favBtn.setAttribute('data-id', b._id || b.id);
  if (window.IS_FAVORITED) {
    favBtn.className = 'btn-fav active';
    favBtn.textContent = '♥ Saved';
  } else {
    favBtn.className = 'btn-fav';
    favBtn.textContent = '♡ Save';
  }
  actions.appendChild(favBtn);
  top.appendChild(actions);
  hero.appendChild(top);
}

// ── Building Info Card ────────────────────────────────────────────────────────

function renderInfoCard() {
  var el = document.getElementById('buildingInfoCard');
  if (!el) { return; }
  var b = window.BUILDING_DATA;

  var rows = [
    ['Price / mo', '$' + b.price.toLocaleString()],
    ['Bedrooms', b.beds],
    ['Bathrooms', b.baths],
    ['Square Feet', b.sqft ? b.sqft.toLocaleString() + ' sqft' : '—'],
    ['Units', b.units || '—'],
    ['Borough / County', b.borough || '—'],
    ['Block', b.block || '—'],
    ['Lot', b.lot || '—'],
    ['Rent Stabilized', b.rentStabilized ? 'Yes' : 'No']
  ];

  for (var i = 0; i < rows.length; i++) {
    var row = document.createElement('div');
    row.className = 'info-row';
    var label = document.createElement('span');
    label.className = 'info-label';
    label.textContent = rows[i][0];
    var val = document.createElement('span');
    val.textContent = rows[i][1];
    row.appendChild(label);
    row.appendChild(val);
    el.appendChild(row);
  }

  if (b.amenities && b.amenities.length > 0) {
    var amRow = document.createElement('div');
    amRow.className = 'info-row';
    var amLabel = document.createElement('span');
    amLabel.className = 'info-label';
    amLabel.textContent = 'Amenities';
    var amTags = document.createElement('div');
    amTags.className = 'amenity-tags';
    for (var j = 0; j < b.amenities.length; j++) {
      var tag = document.createElement('span');
      tag.className = 'amenity-tag';
      tag.textContent = b.amenities[j];
      amTags.appendChild(tag);
    }
    amRow.appendChild(amLabel);
    amRow.appendChild(amTags);
    el.appendChild(amRow);
  }
}

// ── Violations ────────────────────────────────────────────────────────────────

function renderViolations() {
  var el = document.getElementById('violationsSection');
  if (!el) { return; }
  var violations = window.BUILDING_DATA.violations || [];

  if (violations.length === 0) {
    var none = document.createElement('p');
    none.style.color = 'var(--text-muted)';
    none.style.fontSize = '0.9rem';
    none.textContent = 'No violations on record.';
    el.appendChild(none);
    return;
  }

  var table = document.createElement('table');
  table.className = 'violation-table';

  var thead = document.createElement('thead');
  thead.innerHTML =
    '<tr>' +
    '<th>Code</th>' +
    '<th>Description</th>' +
    '<th>Severity</th>' +
    '<th>Status</th>' +
    '<th>Date</th>' +
    '</tr>';
  table.appendChild(thead);

  var tbody = document.createElement('tbody');
  for (var i = 0; i < violations.length; i++) {
    var v = violations[i];
    var tr = document.createElement('tr');
    var sevClass = 'severity-' + (v.severity || '').toLowerCase();
    var statusClass = 'status-' + (v.status || '').toLowerCase();
    tr.innerHTML =
      '<td>' + (v.code || '—') + '</td>' +
      '<td>' + (v.description || '') + '</td>' +
      '<td><span class="severity-badge ' + sevClass + '">' + (v.severity || '') + '</span></td>' +
      '<td><span class="status-badge ' + statusClass + '">' + (v.status || '') + '</span></td>' +
      '<td>' + formatDate(v.date) + '</td>';
    tbody.appendChild(tr);
  }
  table.appendChild(tbody);
  el.appendChild(table);
}

// ── Trust Score ───────────────────────────────────────────────────────────────

function trustColor(score) {
  if (score >= 75) { return 'var(--success)'; }
  if (score >= 50) { return 'var(--accent)'; }
  return 'var(--danger)';
}

function renderTrustScore() {
  var el = document.getElementById('trustScoreCard');
  if (!el) { return; }
  var b = window.BUILDING_DATA;
  var score = b.trustScore || 0;

  var big = document.createElement('div');
  big.className = 'trust-score-big';
  big.style.color = trustColor(score);
  big.textContent = score;
  el.appendChild(big);

  var label = document.createElement('div');
  label.className = 'trust-score-label';
  label.style.color = trustColor(score);
  if (score >= 75) {
    label.textContent = 'Highly Trusted';
  } else if (score >= 50) {
    label.textContent = 'Moderate';
  } else {
    label.textContent = 'Needs Attention';
  }
  el.appendChild(label);

  var violations = b.violations || [];
  var reviews = window.BUILDING_REVIEWS || [];
  var issues = window.BUILDING_ISSUES || [];

  var openViolations = 0;
  for (var i = 0; i < violations.length; i++) {
    if (violations[i].status === 'Open') { openViolations++; }
  }

  var breakdown = document.createElement('div');
  breakdown.className = 'trust-breakdown';

  var rows = [
    ['Reviews', reviews.length + ' total'],
    ['Violations', openViolations + ' open'],
    ['Issues', issues.length + ' reported']
  ];

  for (var j = 0; j < rows.length; j++) {
    var row = document.createElement('div');
    row.className = 'trust-breakdown-row';
    var lbl = document.createElement('span');
    lbl.textContent = rows[j][0];
    var val = document.createElement('span');
    val.textContent = rows[j][1];
    row.appendChild(lbl);
    row.appendChild(val);
    breakdown.appendChild(row);
  }
  el.appendChild(breakdown);
}

// ── Reviews ───────────────────────────────────────────────────────────────────

function renderReviews() {
  var el = document.getElementById('reviewsSection');
  if (!el) { return; }
  var reviews = window.BUILDING_REVIEWS || [];
  var b = window.BUILDING_DATA;
  var buildingId = b._id || b.id;
  var userReview = window.USER_REVIEW || null;
  var loggedIn = window.SESSION_LOGGED_IN;

  if (reviews.length > 0) {
    var total = 0;
    for (var i = 0; i < reviews.length; i++) {
      total += reviews[i].rating;
    }
    var avg = (total / reviews.length).toFixed(1);

    var avgRow = document.createElement('div');
    avgRow.className = 'avg-rating-row';

    var avgBig = document.createElement('div');
    avgBig.className = 'avg-rating-big';
    avgBig.textContent = avg;

    var avgRight = document.createElement('div');
    var avgStars = document.createElement('div');
    avgStars.className = 'avg-stars';
    avgStars.innerHTML = starsHtml(Math.round(parseFloat(avg)));
    var avgCount = document.createElement('div');
    avgCount.className = 'avg-count';
    if (reviews.length === 1) {
      avgCount.textContent = '1 review';
    } else {
      avgCount.textContent = reviews.length + ' reviews';
    }
    avgRight.appendChild(avgStars);
    avgRight.appendChild(avgCount);
    avgRow.appendChild(avgBig);
    avgRow.appendChild(avgRight);
    el.appendChild(avgRow);
  }

  if (!loggedIn) {
    var loginMsg = document.createElement('p');
    loginMsg.style.color = 'var(--text-muted)';
    loginMsg.style.fontSize = '0.88rem';
    loginMsg.style.marginBottom = '20px';
    loginMsg.textContent = 'Sign in to leave a review.';
    el.appendChild(loginMsg);
  } else if (!userReview) {
    var formWrap = document.createElement('div');
    formWrap.className = 'review-form-wrap';

    var starInput = document.createElement('div');
    starInput.className = 'star-input';
    starInput.id = 'starRow';
    for (var s = 1; s <= 5; s++) {
      var star = document.createElement('span');
      star.className = 'star-pick';
      star.setAttribute('data-val', s);
      star.textContent = '★';
      starInput.appendChild(star);
    }
    formWrap.appendChild(starInput);

    var ratingInput = document.createElement('input');
    ratingInput.type = 'hidden';
    ratingInput.id = 'reviewRating';
    ratingInput.value = '0';
    formWrap.appendChild(ratingInput);

    var textarea = document.createElement('textarea');
    textarea.id = 'reviewText';
    textarea.rows = 4;
    formWrap.appendChild(textarea);

    var errEl = document.createElement('div');
    errEl.id = 'reviewError';
    errEl.style.display = 'none';
    errEl.style.color = 'var(--danger)';
    errEl.style.fontSize = '0.85rem';
    formWrap.appendChild(errEl);

    var submitBtn = document.createElement('button');
    submitBtn.className = 'btn btn-primary';
    submitBtn.id = 'submitReview';
    submitBtn.setAttribute('data-building', buildingId);
    submitBtn.textContent = 'Submit Review';
    formWrap.appendChild(submitBtn);

    el.appendChild(formWrap);
  } else {
    var ownWrap = document.createElement('div');
    ownWrap.className = 'review-form-wrap';
    ownWrap.innerHTML =
      '<p style="font-size:0.85rem;color:var(--text-muted);margin:0 0 10px;">You reviewed this building.</p>' +
      '<div style="display:flex;gap:10px;">' +
      '<button class="btn btn-ghost" id="editReviewBtn" data-id="' + userReview._id +
        '" data-rating="' + userReview.rating +
        '" data-text="' + (userReview.text || '').replace(/"/g, '&quot;') + '">Edit</button>' +
      '<button class="btn btn-ghost" id="deleteReviewBtn" data-id="' + userReview._id +
        '" style="color:var(--danger);">Delete</button>' +
      '</div>';
    el.appendChild(ownWrap);
  }

  if (reviews.length === 0) {
    var none = document.createElement('p');
    none.style.color = 'var(--text-muted)';
    none.style.fontSize = '0.9rem';
    none.textContent = 'No reviews yet. Be the first!';
    el.appendChild(none);
    return;
  }

  var list = document.createElement('div');
  list.className = 'reviews-list';

  for (var r = 0; r < reviews.length; r++) {
    var rev = reviews[r];
    var card = document.createElement('div');
    card.className = 'review-card';

    var header = document.createElement('div');
    header.className = 'review-header';

    var userName = document.createElement('span');
    userName.className = 'review-user';
    userName.textContent = (rev.firstName || '') + ' ' + (rev.lastName || '');

    var stars = document.createElement('span');
    stars.className = 'review-stars';
    stars.innerHTML = starsHtml(rev.rating);

    var date = document.createElement('span');
    date.className = 'review-date';
    date.textContent = formatDate(rev.createdAt);

    header.appendChild(userName);
    header.appendChild(stars);
    header.appendChild(date);

    var text = document.createElement('div');
    text.className = 'review-text';
    text.textContent = rev.text;

    card.appendChild(header);
    card.appendChild(text);
    list.appendChild(card);
  }
  el.appendChild(list);
}

// ── Issues ────────────────────────────────────────────────────────────────────

function renderIssues() {
  var el = document.getElementById('issuesSection');
  if (!el) { return; }
  var issues = window.BUILDING_ISSUES || [];
  var b = window.BUILDING_DATA;
  var buildingId = b._id || b.id;
  var loggedIn = window.SESSION_LOGGED_IN;
  var sessionUser = window.SESSION_USER;

  var ISSUE_TYPES = ['Pests', 'Mold', 'Heat', 'Water', 'Noise', 'Security', 'Other'];

  if (!loggedIn) {
    var loginMsg = document.createElement('p');
    loginMsg.style.color = 'var(--text-muted)';
    loginMsg.style.fontSize = '0.88rem';
    loginMsg.style.marginBottom = '20px';
    loginMsg.textContent = 'Sign in to report an issue.';
    el.appendChild(loginMsg);
  } else {
    var formWrap = document.createElement('div');
    formWrap.className = 'issue-form-wrap';

    var select = document.createElement('select');
    select.id = 'issueType';
    select.style.background = 'var(--surface)';
    select.style.border = '1px solid var(--border)';
    select.style.borderRadius = 'var(--radius-sm)';
    select.style.color = 'var(--text)';
    select.style.padding = '8px 12px';
    select.style.fontSize = '0.9rem';

    var defaultOpt = document.createElement('option');
    defaultOpt.value = '';
    defaultOpt.textContent = 'Select issue type...';
    select.appendChild(defaultOpt);

    for (var t = 0; t < ISSUE_TYPES.length; t++) {
      var opt = document.createElement('option');
      opt.value = ISSUE_TYPES[t];
      opt.textContent = ISSUE_TYPES[t];
      select.appendChild(opt);
    }
    formWrap.appendChild(select);

    var textarea = document.createElement('textarea');
    textarea.id = 'issueDescription';
    textarea.rows = 3;
    formWrap.appendChild(textarea);

    var errEl = document.createElement('div');
    errEl.id = 'issueError';
    errEl.style.display = 'none';
    errEl.style.color = 'var(--danger)';
    errEl.style.fontSize = '0.85rem';
    formWrap.appendChild(errEl);

    var submitBtn = document.createElement('button');
    submitBtn.className = 'btn btn-primary';
    submitBtn.id = 'submitIssue';
    submitBtn.setAttribute('data-building', buildingId);
    submitBtn.textContent = 'Report Issue';
    formWrap.appendChild(submitBtn);

    el.appendChild(formWrap);
  }

  if (issues.length === 0) {
    var none = document.createElement('p');
    none.style.color = 'var(--text-muted)';
    none.style.fontSize = '0.9rem';
    none.textContent = 'No issues reported.';
    el.appendChild(none);
    return;
  }

  var list = document.createElement('div');
  list.className = 'issues-list';

  for (var i = 0; i < issues.length; i++) {
    var issue = issues[i];
    var card = document.createElement('div');
    card.className = 'issue-card';

    var header = document.createElement('div');
    header.className = 'issue-header';

    var left = document.createElement('div');
    left.style.display = 'flex';
    left.style.alignItems = 'center';
    left.style.gap = '10px';
    left.style.flexWrap = 'wrap';

    var typeEl = document.createElement('span');
    typeEl.className = 'issue-type';
    typeEl.textContent = issue.type;

    var userEl = document.createElement('span');
    userEl.className = 'issue-user';
    userEl.textContent = (issue.firstName || '') + ' ' + (issue.lastName || '') + ' · ' + formatDate(issue.createdAt);

    left.appendChild(typeEl);
    left.appendChild(userEl);
    header.appendChild(left);

    var isOwner = sessionUser && sessionUser._id === issue.userId;
    var isAdmin = sessionUser && sessionUser.isAdmin;
    if (isOwner || isAdmin) {
      var delBtn = document.createElement('button');
      delBtn.className = 'btn btn-ghost issue-delete-btn';
      delBtn.setAttribute('data-id', issue._id);
      delBtn.style.fontSize = '0.78rem';
      delBtn.style.color = 'var(--danger)';
      delBtn.textContent = 'Delete';
      header.appendChild(delBtn);
    }

    var desc = document.createElement('div');
    desc.className = 'issue-desc';
    desc.textContent = issue.description;

    card.appendChild(header);
    card.appendChild(desc);
    list.appendChild(card);
  }
  el.appendChild(list);
}

// ── Comments ──────────────────────────────────────────────────────────────────

function renderComments() {
  var el = document.getElementById('commentsSection');
  if (!el) { return; }
  var comments = window.BUILDING_COMMENTS || [];
  var b = window.BUILDING_DATA;
  var buildingId = b._id || b.id;
  var loggedIn = window.SESSION_LOGGED_IN;
  var sessionUser = window.SESSION_USER;

  if (!loggedIn) {
    var loginMsg = document.createElement('p');
    loginMsg.style.color = 'var(--text-muted)';
    loginMsg.style.fontSize = '0.88rem';
    loginMsg.style.marginBottom = '20px';
    loginMsg.textContent = 'Sign in to leave a comment.';
    el.appendChild(loginMsg);
  } else {
    var formWrap = document.createElement('div');
    formWrap.className = 'comment-form-wrap';

    var textarea = document.createElement('textarea');
    textarea.id = 'commentText';
    textarea.rows = 3;
    formWrap.appendChild(textarea);

    var errEl = document.createElement('div');
    errEl.id = 'commentError';
    errEl.style.display = 'none';
    errEl.style.color = 'var(--danger)';
    errEl.style.fontSize = '0.85rem';
    formWrap.appendChild(errEl);

    var submitBtn = document.createElement('button');
    submitBtn.className = 'btn btn-primary';
    submitBtn.id = 'submitComment';
    submitBtn.setAttribute('data-building', buildingId);
    submitBtn.textContent = 'Post Comment';
    formWrap.appendChild(submitBtn);

    el.appendChild(formWrap);
  }

  if (comments.length === 0) {
    var none = document.createElement('p');
    none.style.color = 'var(--text-muted)';
    none.style.fontSize = '0.9rem';
    none.textContent = 'No comments yet.';
    el.appendChild(none);
    return;
  }

  var list = document.createElement('div');
  list.className = 'comments-list';

  for (var i = 0; i < comments.length; i++) {
    var comment = comments[i];
    var card = document.createElement('div');
    card.className = 'comment-card';

    var header = document.createElement('div');
    header.className = 'comment-header';

    var userEl = document.createElement('span');
    userEl.style.fontWeight = '700';
    userEl.style.fontSize = '0.88rem';
    userEl.textContent = (comment.firstName || '') + ' ' + (comment.lastName || '');

    var dateEl = document.createElement('span');
    dateEl.style.fontSize = '0.78rem';
    dateEl.style.color = 'var(--text-muted)';
    dateEl.textContent = formatDate(comment.createdAt);

    header.appendChild(userEl);
    header.appendChild(dateEl);

    var text = document.createElement('div');
    text.style.fontSize = '0.9rem';
    text.style.color = 'var(--text-muted)';
    text.style.lineHeight = '1.6';
    text.textContent = comment.text;

    card.appendChild(header);
    card.appendChild(text);

    var isOwner = sessionUser && sessionUser._id === comment.userId;
    var isAdmin = sessionUser && sessionUser.isAdmin;
    if (isOwner || isAdmin) {
      var delBtn = document.createElement('button');
      delBtn.className = 'btn btn-ghost comment-delete-btn';
      delBtn.setAttribute('data-id', comment._id);
      delBtn.style.fontSize = '0.78rem';
      delBtn.style.color = 'var(--danger)';
      delBtn.style.marginTop = '8px';
      delBtn.textContent = 'Delete';
      card.appendChild(delBtn);
    }

    list.appendChild(card);
  }
  el.appendChild(list);
}

// ── Interactive map ───────────────────────────────────────────────────────────

function renderDetailMap() {
  var b     = window.BUILDING_DATA;
  var mapEl = document.getElementById('buildingDetailMap');
  if (!mapEl) {
    return;
  }
  if (!b.lat || !b.lng) {
    var wrap = document.getElementById('buildingDetailMapWrap');
    if (wrap) {
      wrap.style.display = 'none';
    }
    return;
  }

  var map = L.map('buildingDetailMap', {
    center:             [b.lat, b.lng],
    zoom:               16,
    scrollWheelZoom:    false,
    attributionControl: false
  });

  L.tileLayer('https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png', {
    maxZoom: 19
  }).addTo(map);

  var icon = L.divIcon({
    className:  'detail-map-marker',
    iconSize:   [18, 18],
    iconAnchor: [9, 9]
  });

  L.marker([b.lat, b.lng], { icon: icon })
    .addTo(map)
    .bindPopup(
      '<div style="font-family:sans-serif;min-width:160px;">' +
      '<strong>' + b.name + '</strong><br>' +
      '<span style="color:#888;font-size:0.82rem;">' + b.address + ', ' + b.city + '</span><br>' +
      '<span style="color:#f0a03c;font-weight:700;">$' + b.price.toLocaleString() + '/mo</span>' +
      '</div>'
    )
    .openPopup();
}

// ── Wire events ───────────────────────────────────────────────────────────────

function wireEvents() {
  // Fav button
  var favBtn = document.getElementById('favBtn');
  if (favBtn) {
    favBtn.addEventListener('click', function() {
      if (!window.SESSION_LOGGED_IN) {
        authOpenModal('signin');
        return;
      }
      var buildingId = this.getAttribute('data-id');
      var btn = this;
      fetch('/favorites/toggle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ buildingId: buildingId })
      }).then(function(r) { return r.json(); }).then(function(data) {
        if (data.success) {
          if (data.favorited) {
            btn.textContent = '♥ Saved';
            btn.classList.add('active');
            showToast('Saved to favorites ♥');
          } else {
            btn.textContent = '♡ Save';
            btn.classList.remove('active');
            showToast('Removed from favorites');
          }
        }
      }).catch(function() { showToast('Could not update favorites.'); });
    });
  }

  // Star rating picker
  var starRow = document.getElementById('starRow');
  if (starRow) {
    var stars = starRow.querySelectorAll('.star-pick');
    for (var i = 0; i < stars.length; i++) {
      (function(idx) {
        stars[idx].addEventListener('click', function() {
          var val = parseInt(this.getAttribute('data-val'));
          document.getElementById('reviewRating').value = val;
          for (var j = 0; j < stars.length; j++) {
            if (j < val) {
              stars[j].classList.add('active');
            } else {
              stars[j].classList.remove('active');
            }
          }
        });
        stars[idx].addEventListener('mouseover', function() {
          var val = parseInt(this.getAttribute('data-val'));
          for (var j = 0; j < stars.length; j++) {
            if (j < val) {
              stars[j].classList.add('active');
            } else {
              stars[j].classList.remove('active');
            }
          }
        });
      })(i);
    }
    starRow.addEventListener('mouseleave', function() {
      var cur = parseInt(document.getElementById('reviewRating').value) || 0;
      var picks = starRow.querySelectorAll('.star-pick');
      for (var j = 0; j < picks.length; j++) {
        if (j < cur) {
          picks[j].classList.add('active');
        } else {
          picks[j].classList.remove('active');
        }
      }
    });
  }

  // Submit review
  var submitReviewBtn = document.getElementById('submitReview');
  if (submitReviewBtn) {
    submitReviewBtn.addEventListener('click', function() {
      var buildingId = this.getAttribute('data-building');
      var rating = document.getElementById('reviewRating').value;
      var text   = document.getElementById('reviewText').value.trim();
      var errEl  = document.getElementById('reviewError');
      errEl.style.display = 'none';

      if (!rating || parseInt(rating) === 0) {
        errEl.textContent = 'Please select a star rating.';
        errEl.style.display = 'block';
        return;
      }
      if (text.length < 5) {
        errEl.textContent = 'Review must be at least 5 characters.';
        errEl.style.display = 'block';
        return;
      }

      fetch('/reviews/' + buildingId, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rating: rating, text: text })
      }).then(function(r) { return r.json(); }).then(function(data) {
        if (data.success) {
          showToast('Review submitted!');
          window.location.reload();
        } else {
          errEl.textContent = data.error;
          errEl.style.display = 'block';
        }
      }).catch(function() {
        errEl.textContent = 'Error submitting review.';
        errEl.style.display = 'block';
      });
    });
  }

  // Edit own review
  var editReviewBtn = document.getElementById('editReviewBtn');
  if (editReviewBtn) {
    editReviewBtn.addEventListener('click', function() {
      var id        = this.getAttribute('data-id');
      var rating    = this.getAttribute('data-rating');
      var text      = this.getAttribute('data-text');
      var newText   = prompt('Edit your review:', text);
      if (newText === null) { return; }
      var newRating = prompt('New rating (1-5):', rating);
      if (!newRating || isNaN(parseInt(newRating))) { return; }
      fetch('/reviews/' + id, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rating: parseInt(newRating), text: newText.trim() })
      }).then(function(r) { return r.json(); }).then(function(data) {
        if (data.success) {
          showToast('Review updated!');
          window.location.reload();
        } else {
          showToast(data.error || 'Error updating review.');
        }
      });
    });
  }

  // Delete own review
  var deleteReviewBtn = document.getElementById('deleteReviewBtn');
  if (deleteReviewBtn) {
    deleteReviewBtn.addEventListener('click', function() {
      if (!confirm('Delete your review?')) { return; }
      var id = this.getAttribute('data-id');
      fetch('/reviews/' + id, { method: 'DELETE' })
        .then(function(r) { return r.json(); })
        .then(function(data) {
          if (data.success) {
            showToast('Review deleted.');
            window.location.reload();
          } else {
            showToast(data.error || 'Error deleting review.');
          }
        });
    });
  }

  // Submit issue
  var submitIssueBtn = document.getElementById('submitIssue');
  if (submitIssueBtn) {
    submitIssueBtn.addEventListener('click', function() {
      var buildingId  = this.getAttribute('data-building');
      var type        = document.getElementById('issueType').value;
      var description = document.getElementById('issueDescription').value.trim();
      var errEl       = document.getElementById('issueError');
      errEl.style.display = 'none';

      if (!type) {
        errEl.textContent = 'Please select an issue type.';
        errEl.style.display = 'block';
        return;
      }
      if (description.length < 10) {
        errEl.textContent = 'Description must be at least 10 characters.';
        errEl.style.display = 'block';
        return;
      }

      fetch('/issues/' + buildingId, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: type, description: description })
      }).then(function(r) { return r.json(); }).then(function(data) {
        if (data.success) {
          showToast('Issue reported!');
          window.location.reload();
        } else {
          errEl.textContent = data.error;
          errEl.style.display = 'block';
        }
      }).catch(function() {
        errEl.textContent = 'Error reporting issue.';
        errEl.style.display = 'block';
      });
    });
  }

  // Delete issue buttons
  var issueDelBtns = document.querySelectorAll('.issue-delete-btn');
  for (var id = 0; id < issueDelBtns.length; id++) {
    (function(btn) {
      btn.addEventListener('click', function() {
        if (!confirm('Delete this report?')) { return; }
        var issueId = this.getAttribute('data-id');
        fetch('/issues/' + issueId, { method: 'DELETE' })
          .then(function(r) { return r.json(); })
          .then(function(data) {
            if (data.success) {
              showToast('Deleted.');
              window.location.reload();
            } else {
              showToast(data.error || 'Error deleting issue.');
            }
          });
      });
    })(issueDelBtns[id]);
  }

  // Submit comment
  var submitCommentBtn = document.getElementById('submitComment');
  if (submitCommentBtn) {
    submitCommentBtn.addEventListener('click', function() {
      var buildingId = this.getAttribute('data-building');
      var text = document.getElementById('commentText').value.trim();
      var errEl = document.getElementById('commentError');
      errEl.style.display = 'none';

      if (!text) {
        errEl.textContent = 'Comment cannot be empty.';
        errEl.style.display = 'block';
        return;
      }

      fetch('/comments/' + buildingId, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: text })
      }).then(function(r) { return r.json(); }).then(function(data) {
        if (data.success) {
          showToast('Comment posted!');
          window.location.reload();
        } else {
          errEl.textContent = data.error;
          errEl.style.display = 'block';
        }
      }).catch(function() {
        errEl.textContent = 'Error posting comment.';
        errEl.style.display = 'block';
      });
    });
  }

  // Delete comment buttons
  var commentDelBtns = document.querySelectorAll('.comment-delete-btn');
  for (var cd = 0; cd < commentDelBtns.length; cd++) {
    (function(btn) {
      btn.addEventListener('click', function() {
        if (!confirm('Delete this comment?')) { return; }
        var commentId = this.getAttribute('data-id');
        fetch('/comments/' + commentId, { method: 'DELETE' })
          .then(function(r) { return r.json(); })
          .then(function(data) {
            if (data.success) {
              showToast('Deleted.');
              window.location.reload();
            } else {
              showToast(data.error || 'Error deleting comment.');
            }
          });
      });
    })(commentDelBtns[cd]);
  }
}

// ── Init ──────────────────────────────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', function() {
  renderHero();
  renderDetailMap();
  renderInfoCard();
  renderViolations();
  renderTrustScore();
  renderReviews();
  renderIssues();
  renderComments();
  wireEvents();
});
