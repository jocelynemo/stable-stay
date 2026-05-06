// building-interactive.js — AJAX interactions for the building detail page

function showToast(msg) {
  var t = document.getElementById('toast');
  if (!t) return;
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(function() { t.classList.remove('show'); }, 2800);
}

// ── Favorites ─────────────────────────────────────────────────────────────────
var favBtn = document.getElementById('favBtn');
if (favBtn) {
  favBtn.addEventListener('click', async function() {
    var buildingId = this.getAttribute('data-id');
    try {
      var res = await fetch('/favorites/toggle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ buildingId })
      });
      var data = await res.json();
      if (res.status === 401) { showToast(data.error || 'Please sign in to save favorites.'); return; }
      if (data.success) {
        if (data.favorited) {
          this.textContent = '♥ Saved';
          this.classList.remove('btn-ghost');
          this.classList.add('btn-primary');
          showToast('Saved to favorites ♥');
        } else {
          this.textContent = '♡ Save';
          this.classList.remove('btn-primary');
          this.classList.add('btn-ghost');
          showToast('Removed from favorites');
        }
      }
    } catch(e) { showToast('Could not update favorites.'); }
  });
}

// ── Star rating picker ────────────────────────────────────────────────────────
var starRow = document.getElementById('starRow');
if (starRow) {
  var stars = starRow.querySelectorAll('.star-btn');
  for (var i = 0; i < stars.length; i++) {
    (function(idx) {
      stars[idx].addEventListener('click', function() {
        var val = parseInt(this.getAttribute('data-val'));
        document.getElementById('reviewRating').value = val;
        for (var j = 0; j < stars.length; j++) {
          stars[j].style.color = j < val ? '#f59e0b' : 'var(--text-dim)';
        }
      });
      stars[idx].addEventListener('mouseover', function() {
        var val = parseInt(this.getAttribute('data-val'));
        for (var j = 0; j < stars.length; j++) {
          stars[j].style.color = j < val ? '#f59e0b' : 'var(--text-dim)';
        }
      });
    })(i);
  }
  starRow.addEventListener('mouseleave', function() {
    var cur = parseInt(document.getElementById('reviewRating').value) || 0;
    for (var j = 0; j < stars.length; j++) {
      stars[j].style.color = j < cur ? '#f59e0b' : 'var(--text-dim)';
    }
  });
}

// ── Submit review ─────────────────────────────────────────────────────────────
var submitReviewBtn = document.getElementById('submitReview');
if (submitReviewBtn) {
  submitReviewBtn.addEventListener('click', async function() {
    var buildingId = this.getAttribute('data-building');
    var rating = document.getElementById('reviewRating').value;
    var text   = document.getElementById('reviewText').value.trim();
    var errEl  = document.getElementById('reviewError');
    if (errEl) errEl.style.display = 'none';

    if (!rating) { if (errEl) { errEl.textContent = 'Please select a star rating.'; errEl.style.display = 'block'; } return; }
    if (text.length < 5) { if (errEl) { errEl.textContent = 'Review must be at least 5 characters.'; errEl.style.display = 'block'; } return; }

    try {
      var res = await fetch('/reviews/' + buildingId, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rating, text })
      });
      var data = await res.json();
      if (res.status === 401) { showToast(data.error || 'Please sign in.'); return; }
      if (data.success) {
        showToast('Review submitted!');
        window.location.reload();
      } else {
        if (errEl) { errEl.textContent = data.error; errEl.style.display = 'block'; }
      }
    } catch(e) { if (errEl) { errEl.textContent = 'Error submitting review.'; errEl.style.display = 'block'; } }
  });
}

// ── Edit/delete review ────────────────────────────────────────────────────────
var editReviewBtn = document.getElementById('editReviewBtn');
if (editReviewBtn) {
  editReviewBtn.addEventListener('click', function() {
    var id   = this.getAttribute('data-id');
    var rating = this.getAttribute('data-rating');
    var store = document.getElementById('myReviewFullText');
    var text = store ? store.textContent : (this.getAttribute('data-text') || '');
    var newText = prompt('Edit your review:', text);
    if (newText === null) return;
    var newRating = prompt('New rating (1-5):', rating);
    if (!newRating || isNaN(parseInt(newRating))) return;
    fetch('/reviews/' + id, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ rating: parseInt(newRating), text: newText.trim() })
    }).then(function(r) { return r.json(); }).then(function(data) {
      if (data.success) { showToast('Review updated!'); window.location.reload(); }
      else showToast(data.error || 'Error updating review.');
    });
  });
}

var deleteReviewBtn = document.getElementById('deleteReviewBtn');
if (deleteReviewBtn) {
  deleteReviewBtn.addEventListener('click', function() {
    if (!confirm('Delete your review?')) return;
    var id = this.getAttribute('data-id');
    fetch('/reviews/' + id, { method: 'DELETE' })
      .then(function(r) { return r.json(); })
      .then(function(data) {
        if (data.success) { showToast('Review deleted.'); window.location.reload(); }
        else showToast(data.error || 'Error deleting review.');
      });
  });
}

// inline edit/delete for other users' own reviews (review cards)
document.querySelectorAll('.review-edit-btn').forEach(function(btn) {
  btn.addEventListener('click', function() {
    var id = this.getAttribute('data-id');
    var rating = this.getAttribute('data-rating');
    var text = this.getAttribute('data-text');
    var newText = prompt('Edit your review:', text);
    if (newText === null) return;
    var newRating = prompt('New rating (1-5):', rating);
    if (!newRating) return;
    fetch('/reviews/' + id, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ rating: parseInt(newRating), text: newText.trim() })
    }).then(r => r.json()).then(data => {
      if (data.success) { showToast('Updated!'); window.location.reload(); }
      else showToast(data.error);
    });
  });
});

document.querySelectorAll('.review-delete-btn').forEach(function(btn) {
  btn.addEventListener('click', function() {
    if (!confirm('Delete your review?')) return;
    fetch('/reviews/' + this.getAttribute('data-id'), { method: 'DELETE' })
      .then(r => r.json()).then(data => {
        if (data.success) { showToast('Deleted.'); window.location.reload(); }
        else showToast(data.error);
      });
  });
});

// ── Submit issue ──────────────────────────────────────────────────────────────
var submitIssueBtn = document.getElementById('submitIssue');
if (submitIssueBtn) {
  submitIssueBtn.addEventListener('click', async function() {
    var buildingId  = this.getAttribute('data-building');
    var type        = document.getElementById('issueType').value;
    var description = document.getElementById('issueDescription').value.trim();
    var errEl       = document.getElementById('issueError');
    errEl.style.display = 'none';

    if (!type) { errEl.textContent = 'Please select an issue type.'; errEl.style.display = 'block'; return; }
    if (description.length < 10) { errEl.textContent = 'Description must be at least 10 characters.'; errEl.style.display = 'block'; return; }

    try {
      var res = await fetch('/issues/' + buildingId, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, description })
      });
      var data = await res.json();
      if (data.success) { showToast('Issue reported!'); window.location.reload(); }
      else { errEl.textContent = data.error; errEl.style.display = 'block'; }
    } catch(e) { errEl.textContent = 'Error reporting issue.'; errEl.style.display = 'block'; }
  });
}

document.querySelectorAll('.issue-delete-btn').forEach(function(btn) {
  btn.addEventListener('click', function() {
    if (!confirm('Delete this report?')) return;
    fetch('/issues/' + this.getAttribute('data-id'), { method: 'DELETE' })
      .then(r => r.json()).then(data => {
        if (data.success) { showToast('Deleted.'); window.location.reload(); }
        else showToast(data.error);
      });
  });
});

// ── Submit comment ────────────────────────────────────────────────────────────
var submitCommentBtn = document.getElementById('submitComment');
if (submitCommentBtn) {
  submitCommentBtn.addEventListener('click', async function() {
    var buildingId = this.getAttribute('data-building');
    var text = document.getElementById('commentText').value.trim();
    var errEl = document.getElementById('commentError');
    errEl.style.display = 'none';

    if (!text) { errEl.textContent = 'Comment cannot be empty.'; errEl.style.display = 'block'; return; }

    try {
      var res = await fetch('/comments/' + buildingId, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text })
      });
      var data = await res.json();
      if (data.success) {
        document.getElementById('commentText').value = '';
        showToast('Comment posted!');
        window.location.reload();
      } else { errEl.textContent = data.error; errEl.style.display = 'block'; }
    } catch(e) { errEl.textContent = 'Error posting comment.'; errEl.style.display = 'block'; }
  });
}

document.querySelectorAll('.comment-delete-btn').forEach(function(btn) {
  btn.addEventListener('click', function() {
    if (!confirm('Delete this comment?')) return;
    fetch('/comments/' + this.getAttribute('data-id'), { method: 'DELETE' })
      .then(r => r.json()).then(data => {
        if (data.success) { showToast('Deleted.'); window.location.reload(); }
        else showToast(data.error);
      });
  });
});

// ── Violation table: severity/status CSS + sortable columns ───────────────────
function decorateViolationTable() {
  var el = document.getElementById('violationsSection');
  if (!el) return;
  el.querySelectorAll('.severity-badge').forEach(function(b) {
    var t = (b.textContent || '').trim().toLowerCase();
    if (t) b.classList.add('severity-' + t);
  });
  el.querySelectorAll('.status-badge').forEach(function(b) {
    var t = (b.textContent || '').trim().toLowerCase();
    if (t.indexOf('open') !== -1) b.classList.add('status-open');
    else b.classList.add('status-closed');
  });

  var headers = el.querySelectorAll('th[data-col]');
  if (!headers.length) return;
  var sortDir = {};
  for (var i = 0; i < headers.length; i++) {
    headers[i].addEventListener('click', function() {
      var colIdx = parseInt(this.getAttribute('data-col'), 10);
      sortDir[colIdx] = !sortDir[colIdx];
      var tbody = el.querySelector('tbody');
      if (!tbody) return;
      var rowsArr = Array.prototype.slice.call(tbody.querySelectorAll('tr'));
      rowsArr.sort(function(a, b) {
        var aVal = a.children[colIdx].textContent.trim();
        var bVal = b.children[colIdx].textContent.trim();
        if (sortDir[colIdx]) return aVal > bVal ? 1 : -1;
        return aVal < bVal ? 1 : -1;
      });
      for (var j = 0; j < rowsArr.length; j++) tbody.appendChild(rowsArr[j]);
      for (var j = 0; j < headers.length; j++) headers[j].classList.remove('sort-asc', 'sort-desc');
      this.classList.add(sortDir[colIdx] ? 'sort-asc' : 'sort-desc');
    });
  }
}

function decorateTrustScore() {
  document.querySelectorAll('.trust-score-dynamic').forEach(function(el) {
    var s = parseInt(el.getAttribute('data-score'), 10);
    if (isNaN(s)) s = 0;
    var color = s >= 80 ? 'var(--success)' : (s >= 60 ? 'var(--accent)' : 'var(--danger)');
    el.style.color = color;
  });
  var lbl = document.querySelector('.trust-score-dynamic-label');
  if (lbl) {
    var s = parseInt(lbl.getAttribute('data-score'), 10);
    if (isNaN(s)) s = 0;
    var label = s >= 80 ? 'Good' : (s >= 60 ? 'Moderate' : 'Poor');
    var color = s >= 80 ? 'var(--success)' : (s >= 60 ? 'var(--accent)' : 'var(--danger)');
    lbl.textContent = label + ' Trust Score';
    lbl.style.color = color;
  }
}

var reviewSignInBtn = document.getElementById('reviewSignInBtn');
if (reviewSignInBtn && typeof authOpenModal === 'function') {
  reviewSignInBtn.addEventListener('click', function() { authOpenModal('signin'); });
}

decorateViolationTable();
decorateTrustScore();
