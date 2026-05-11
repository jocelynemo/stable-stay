var user      = window.PROFILE_USER   || {};
var favorites = window.USER_FAVORITES || [];

// Helpers

function val(id) {
  var el = document.getElementById(id);
  if (el) {
    return el.value.trim();
  }
  return '';
}

function set(id, v) {
  var el = document.getElementById(id);
  if (el) {
    el.value = v || '';
  }
}

function showToast(msg) {
  var t = document.getElementById('toast');
  if (!t) {
    return;
  }
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(function () {
    t.classList.remove('show');
  }, 2800);
}

function showMsg(id, msg, ok) {
  var el = document.getElementById(id);
  if (!el) {
    return;
  }
  el.textContent = msg;
  el.style.display = 'block';
  if (ok) {
    el.style.background = 'rgba(74,222,128,0.12)';
    el.style.color = 'var(--success)';
  } else {
    el.style.background = 'rgba(248,113,113,0.12)';
    el.style.color = 'var(--danger)';
  }
}

// Populate sidebar + form fields

function populateUser(u) {
  var firstInitial = (u.firstName || '')[0] || '';
  var lastInitial  = (u.lastName  || '')[0] || '';
  var initials = firstInitial + lastInitial;

  var nameEl = document.getElementById('avatarInitials');
  var dnEl   = document.getElementById('profileDisplayName');
  var deEl   = document.getElementById('profileDisplayEmail');

  if (nameEl) {
    nameEl.textContent = initials.toUpperCase() || '?';
  }
  if (dnEl) {
    dnEl.textContent = `${u.firstName || ''} ${u.lastName || ''}`;
  }
  if (deEl) {
    deEl.textContent = u.email || '';
  }

  set('profileFirstName', u.firstName);
  set('profileLastName',  u.lastName);
  set('profileEmail',     u.email);
  set('profilePhone',     u.phone);
  set('profileCity',      u.city);
  set('profileState',     u.state);
  set('profileZip',       u.zip);
}

// Section navigation

function initNav() {
  var links    = document.querySelectorAll('.profile-nav a[data-section]');
  var sections = document.querySelectorAll('.profile-section');

  for (var i = 0; i < links.length; i++) {
    links[i].addEventListener('click', function (e) {
      e.preventDefault();
      var target = this.getAttribute('data-section');

      for (var j = 0; j < links.length; j++) {
        links[j].classList.remove('active');
      }
      for (var k = 0; k < sections.length; k++) {
        sections[k].classList.remove('active');
      }

      this.classList.add('active');
      var sec = document.getElementById(target);
      if (sec) {
        sec.classList.add('active');
      }
    });
  }
}

// Save profile

function initSaveProfile() {
  var btn = document.getElementById('saveProfile');
  if (!btn) {
    return;
  }

  btn.addEventListener('click', function () {
    btn.disabled = true;
    btn.textContent = 'Saving…';

    fetch('/profile/update', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        firstName: val('profileFirstName'),
        lastName:  val('profileLastName'),
        email:     val('profileEmail'),
        phone:     val('profilePhone'),
        city:      val('profileCity'),
        state:     val('profileState'),
        zip:       val('profileZip')
      })
    })
      .then(function (r) { return r.json(); })
      .then(function (data) {
        if (data.success) {
          user = data.user;
          populateUser(user);
          showMsg('profileMsg', 'Changes saved.', true);
          showToast('Profile updated ✓');
        } else {
          showMsg('profileMsg', data.error || 'Could not save.', false);
        }
      })
      .catch(function () {
        showMsg('profileMsg', 'Something went wrong.', false);
      })
      .finally(function () {
        btn.disabled = false;
        btn.textContent = 'Save Changes';
      });
  });
}

// Change password

function initChangePassword() {
  var btn = document.getElementById('changePassword');
  if (!btn) {
    return;
  }

  btn.addEventListener('click', function () {
    var current = val('pwCurrent');
    var next    = val('pwNew');
    var confirm = val('pwConfirm');
    var errEl   = document.getElementById('pwError');

    if (errEl) {
      errEl.style.display = 'none';
    }

    if (!current || !next || !confirm) {
      if (errEl) {
        errEl.textContent = 'All fields are required.';
        errEl.style.display = 'block';
      }
      return;
    }

    if (next !== confirm) {
      if (errEl) {
        errEl.textContent = 'New passwords do not match.';
        errEl.style.display = 'block';
      }
      return;
    }

    btn.disabled = true;
    btn.textContent = 'Updating…';

    fetch('/profile/change-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ currentPassword: current, newPassword: next, confirmPassword: confirm })
    })
      .then(function (r) { return r.json(); })
      .then(function (data) {
        if (data.success) {
          document.getElementById('pwCurrent').value = '';
          document.getElementById('pwNew').value = '';
          document.getElementById('pwConfirm').value = '';
          showMsg('pwMsg', 'Password updated.', true);
          showToast('Password changed ✓');
        } else {
          if (errEl) {
            errEl.textContent = data.error || 'Could not update password.';
            errEl.style.display = 'block';
          }
        }
      })
      .catch(function () {
        if (errEl) {
          errEl.textContent = 'Something went wrong.';
          errEl.style.display = 'block';
        }
      })
      .finally(function () {
        btn.disabled = false;
        btn.textContent = 'Update Password';
      });
  });
}

// Favorites grid

function renderFavorites() {
  var grid = document.getElementById('favoritesGrid');
  if (!grid) {
    return;
  }

  if (!favorites || favorites.length === 0) {
    grid.innerHTML = '<p style="color:var(--text-muted);padding:20px 0;">No saved listings yet. Heart a listing on the Browse page to save it here.</p>';
    return;
  }

  grid.innerHTML = '';

  for (var i = 0; i < favorites.length; i++) {
    var b    = favorites[i];
    var id   = b._id || String(b.id || i);
    var card = document.createElement('div');
    card.className = 'listing-card';
    card.style.cursor = 'pointer';

    card.addEventListener('click', (function (bid) {
      return function () {
        window.location.href = `/buildings/${bid}`;
      };
    })(id));

    card.innerHTML = `
      <div class="listing-img">
        <div class="img-placeholder">
          <span class="icon">🏢</span>
          <span>${b.name || 'Building'}</span>
        </div>
      </div>
      <div class="listing-info">
        <div class="listing-price">$${(b.price || 0).toLocaleString()}<span>/mo</span></div>
        <div class="listing-name">${b.name || ''}</div>
        <div class="listing-location">📍 ${b.city || ''}, ${b.state || 'NY'} ${b.zip || ''}</div>
        <div class="listing-meta">
          <div class="listing-meta-item">🛏 ${b.beds || '?'} bd</div>
          <div class="listing-meta-item">🚿 ${b.baths || '?'} ba</div>
          <div class="listing-meta-item">📐 ${b.sqft || '?'} sqft</div>
        </div>
      </div>
    `;

    grid.appendChild(card);
  }
}

// Init

document.addEventListener('DOMContentLoaded', function () {
  populateUser(user);
  initNav();
  initSaveProfile();
  initChangePassword();
  renderFavorites();
});
