// auth.js - shared authentication module (included on every page)

var AUTH_USERS_KEY = "ss_users";
var AUTH_SESSION_KEY = "ss_session";

// ── Storage helpers ──────────────────────────────────────────────────────────

function authGetUsers() {
  var s = localStorage.getItem(AUTH_USERS_KEY);
  return s ? JSON.parse(s) : [];
}

function authSaveUsers(users) {
  localStorage.setItem(AUTH_USERS_KEY, JSON.stringify(users));
}

function authGetCurrentUser() {
  var s = localStorage.getItem(AUTH_SESSION_KEY);
  return s ? JSON.parse(s) : null;
}

function authSetSession(user) {
  // never store password in session
  var session = {
    firstName: user.firstName,
    lastName:  user.lastName,
    email:     user.email,
    phone:     user.phone   || "",
    city:      user.city    || "",
    state:     user.state   || "",
    zip:       user.zip     || "",
    isAdmin:   user.isAdmin || false
  };
  localStorage.setItem(AUTH_SESSION_KEY, JSON.stringify(session));
}

function authClearSession() {
  localStorage.removeItem(AUTH_SESSION_KEY);
}

// ── Auth operations ──────────────────────────────────────────────────────────

function authRegister(firstName, lastName, email, password) {
  var users = authGetUsers();
  for (var i = 0; i < users.length; i++) {
    if (users[i].email.toLowerCase() === email.toLowerCase()) {
      return { success: false, error: "An account with this email already exists." };
    }
  }
  var user = {
    firstName: firstName, lastName: lastName,
    email: email, password: password,
    phone: "", city: "", state: "NJ", zip: ""
  };
  users.push(user);
  authSaveUsers(users);
  authSetSession(user);
  return { success: true, user: user };
}

function authLogin(email, password) {
  var users = authGetUsers();
  for (var i = 0; i < users.length; i++) {
    if (users[i].email.toLowerCase() === email.toLowerCase() &&
        users[i].password === password) {
      authSetSession(users[i]);
      return { success: true, user: users[i] };
    }
  }
  return { success: false, error: "Incorrect email or password." };
}

function authLogout() {
  authClearSession();
}

function authUpdateUserProfile(updates) {
  var users = authGetUsers();
  var current = authGetCurrentUser();
  if (!current) return false;
  for (var i = 0; i < users.length; i++) {
    if (users[i].email.toLowerCase() === current.email.toLowerCase()) {
      if (updates.firstName !== undefined) users[i].firstName = updates.firstName;
      if (updates.lastName  !== undefined) users[i].lastName  = updates.lastName;
      if (updates.phone     !== undefined) users[i].phone     = updates.phone;
      if (updates.city      !== undefined) users[i].city      = updates.city;
      if (updates.state     !== undefined) users[i].state     = updates.state;
      if (updates.zip       !== undefined) users[i].zip       = updates.zip;
      authSaveUsers(users);
      authSetSession(users[i]);
      return true;
    }
  }
  return false;
}

function authChangePassword(currentPw, newPw) {
  var users = authGetUsers();
  var current = authGetCurrentUser();
  if (!current) return { success: false, error: "Not logged in." };
  for (var i = 0; i < users.length; i++) {
    if (users[i].email.toLowerCase() === current.email.toLowerCase()) {
      if (users[i].password !== currentPw) {
        return { success: false, error: "Current password is incorrect." };
      }
      if (newPw.length < 6) {
        return { success: false, error: "New password must be at least 6 characters." };
      }
      users[i].password = newPw;
      authSaveUsers(users);
      return { success: true };
    }
  }
  return { success: false, error: "User not found." };
}

// ── Nav ──────────────────────────────────────────────────────────────────────

function authUpdateNav() {
  var user = authGetCurrentUser();
  var navActions = document.querySelector(".nav-actions");
  if (!navActions) return;

  if (user) {
    var adminLink = user.isAdmin ? '<a href="/admin" class="btn btn-ghost">Admin</a>' : '';
    navActions.innerHTML =
      '<span style="font-size:0.88rem;color:var(--text-muted);font-weight:500;padding:0 4px;">Hi, ' + user.firstName + '</span>' +
      adminLink +
      '<a href="/profile" class="btn btn-ghost">My Profile</a>' +
      '<button class="btn btn-primary" id="navSignOutBtn">Sign Out</button>';

    document.getElementById("navSignOutBtn").addEventListener("click", function() {
      authLogout();
      if (window.location.pathname.indexOf("/profile") !== -1) {
        window.location.href = "/";
      } else {
        authUpdateNav();
        authShowToast("Signed out successfully.");
      }
    });
  } else {
    navActions.innerHTML =
      '<button class="btn btn-ghost" id="navSignInBtn">Sign In</button>' +
      '<button class="btn btn-primary" id="navRegisterBtn">Get Started</button>';

    document.getElementById("navSignInBtn").addEventListener("click", function() {
      authOpenModal("signin");
    });
    document.getElementById("navRegisterBtn").addEventListener("click", function() {
      authOpenModal("register");
    });
  }
}

// ── Modal ────────────────────────────────────────────────────────────────────

var AUTH_MODAL_HTML =
  '<div class="modal-overlay" id="authModal">' +
    '<div class="modal">' +
      '<button class="modal-close" id="authModalClose">✕</button>' +
      '<h2 class="modal-title">Welcome Back</h2>' +
      '<p class="modal-sub">Sign in to access your saved listings and profile.</p>' +
      '<div class="modal-tabs">' +
        '<button class="modal-tab active" data-mode="signin">Sign In</button>' +
        '<button class="modal-tab" data-mode="register">Register</button>' +
      '</div>' +
      '<div class="modal-form" id="authSignInFields" style="display:flex;flex-direction:column;gap:14px;">' +
        '<div class="form-group"><label>Email</label>' +
          '<input type="email" id="authSiEmail" placeholder="you@email.com" /></div>' +
        '<div class="form-group"><label>Password</label>' +
          '<input type="password" id="authSiPassword" placeholder="••••••••" /></div>' +
        '<div id="authSiError" style="color:var(--danger);font-size:0.85rem;display:none;margin-top:-4px;"></div>' +
        '<button class="btn btn-primary full-width mt-8" id="authSiSubmit">Sign In</button>' +
      '</div>' +
      '<div class="modal-form" id="authRegFields" style="display:none;flex-direction:column;gap:14px;">' +
        '<div class="form-row">' +
          '<div class="form-group"><label>First Name</label>' +
            '<input type="text" id="authRegFirst" placeholder="Alex" /></div>' +
          '<div class="form-group"><label>Last Name</label>' +
            '<input type="text" id="authRegLast" placeholder="Rivera" /></div>' +
        '</div>' +
        '<div class="form-group"><label>Email</label>' +
          '<input type="email" id="authRegEmail" placeholder="you@email.com" /></div>' +
        '<div class="form-group"><label>Password</label>' +
          '<input type="password" id="authRegPassword" placeholder="At least 6 characters" /></div>' +
        '<div id="authRegError" style="color:var(--danger);font-size:0.85rem;display:none;margin-top:-4px;"></div>' +
        '<button class="btn btn-primary full-width mt-8" id="authRegSubmit">Create Account</button>' +
      '</div>' +
    '</div>' +
  '</div>';

function authEnsureModal() {
  if (document.getElementById("authModal")) return;
  var div = document.createElement("div");
  div.innerHTML = AUTH_MODAL_HTML;
  document.body.appendChild(div.firstChild);
}

function authOpenModal(mode) {
  authEnsureModal();
  document.getElementById("authModal").classList.add("open");
  authSwitchMode(mode);
  authWireModal();
}

function authCloseModal() {
  var m = document.getElementById("authModal");
  if (m) m.classList.remove("open");
}

function authSwitchMode(mode) {
  var si  = document.getElementById("authSignInFields");
  var reg = document.getElementById("authRegFields");
  var tabs = document.querySelectorAll("#authModal .modal-tab");
  if (!si || !reg) return;
  if (mode === "signin") {
    si.style.display  = "flex";
    reg.style.display = "none";
  } else {
    si.style.display  = "none";
    reg.style.display = "flex";
  }
  for (var i = 0; i < tabs.length; i++) {
    tabs[i].classList.toggle("active", tabs[i].getAttribute("data-mode") === mode);
  }
}

function authWireModal() {
  var overlay = document.getElementById("authModal");
  if (!overlay || overlay._wired) return;
  overlay._wired = true;

  // close button
  document.getElementById("authModalClose").addEventListener("click", authCloseModal);

  // overlay click
  overlay.addEventListener("click", function(e) {
    if (e.target === overlay) authCloseModal();
  });

  // tab switching
  var tabs = overlay.querySelectorAll(".modal-tab");
  for (var i = 0; i < tabs.length; i++) {
    tabs[i].addEventListener("click", function() {
      authSwitchMode(this.getAttribute("data-mode"));
    });
  }

  // sign in submit
  document.getElementById("authSiSubmit").addEventListener("click", function() {
    var email    = document.getElementById("authSiEmail").value.trim();
    var password = document.getElementById("authSiPassword").value;
    var errEl    = document.getElementById("authSiError");
    errEl.style.display = "none";

    if (!email || !password) {
      errEl.textContent = "Please fill in all fields.";
      errEl.style.display = "block";
      return;
    }
    var result = authLogin(email, password);
    if (result.success) {
      authCloseModal();
      authUpdateNav();
      authShowToast("Welcome back, " + result.user.firstName + "!");
    } else {
      errEl.textContent = result.error;
      errEl.style.display = "block";
    }
  });

  // enter key on password field
  document.getElementById("authSiPassword").addEventListener("keydown", function(e) {
    if (e.key === "Enter") document.getElementById("authSiSubmit").click();
  });

  // register submit
  document.getElementById("authRegSubmit").addEventListener("click", function() {
    var first    = document.getElementById("authRegFirst").value.trim();
    var last     = document.getElementById("authRegLast").value.trim();
    var email    = document.getElementById("authRegEmail").value.trim();
    var password = document.getElementById("authRegPassword").value;
    var errEl    = document.getElementById("authRegError");
    errEl.style.display = "none";

    if (!first || !last || !email || !password) {
      errEl.textContent = "Please fill in all fields.";
      errEl.style.display = "block";
      return;
    }
    if (password.length < 6) {
      errEl.textContent = "Password must be at least 6 characters.";
      errEl.style.display = "block";
      return;
    }
    var result = authRegister(first, last, email, password);
    if (result.success) {
      authCloseModal();
      authUpdateNav();
      authShowToast("Welcome, " + first + "! Your account is ready.");
    } else {
      errEl.textContent = result.error;
      errEl.style.display = "block";
    }
  });
}

// ── Toast helper ─────────────────────────────────────────────────────────────

function authShowToast(message) {
  var toast = document.getElementById("toast");
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add("show");
  setTimeout(function() { toast.classList.remove("show"); }, 2800);
}

// ── ESC key ──────────────────────────────────────────────────────────────────

document.addEventListener("keydown", function(e) {
  if (e.key === "Escape") authCloseModal();
});

// ── Admin seeding ─────────────────────────────────────────────────────────────

function authSeedAdmin() {
  var users = authGetUsers();
  for (var i = 0; i < users.length; i++) {
    if (users[i].email.toLowerCase() === "admin@stablestay.com") return;
  }
  users.push({
    firstName: "Admin", lastName: "StableStay",
    email: "admin@stablestay.com", password: "admin123",
    phone: "", city: "", state: "NJ", zip: "",
    isAdmin: true
  });
  authSaveUsers(users);
}

// ── Init ─────────────────────────────────────────────────────────────────────

document.addEventListener("DOMContentLoaded", function() {
  authSeedAdmin();
  authUpdateNav();
  authEnsureModal();
  authWireModal();
});
