function setModalMode(mode) {
  var siFields  = document.getElementById('authSignInFields');
  var regFields = document.getElementById('authRegFields');
  var tabs      = document.querySelectorAll('.modal-tab');

  if (mode === 'register') {
    if (siFields)  { siFields.style.display  = 'none'; }
    if (regFields) { regFields.style.display = 'flex'; }
  } else {
    if (siFields)  { siFields.style.display  = 'flex'; }
    if (regFields) { regFields.style.display = 'none'; }
  }

  for (var i = 0; i < tabs.length; i++) {
    if (tabs[i].getAttribute('data-mode') === mode) {
      tabs[i].classList.add('active');
    } else {
      tabs[i].classList.remove('active');
    }
  }
}

function authOpenModal(mode) {
  var modal = document.getElementById('authModal');
  if (!modal) {
    return;
  }
  setModalMode(mode || 'signin');
  modal.classList.add('open');
}

function authCloseModal() {
  var modal = document.getElementById('authModal');
  if (modal) {
    modal.classList.remove('open');
  }
}

function showAuthToast(msg) {
  var toast = document.getElementById('toast');
  if (!toast) {
    return;
  }
  toast.textContent = msg;
  toast.classList.add('show');
  setTimeout(function () {
    toast.classList.remove('show');
  }, 2800);
}

document.addEventListener('DOMContentLoaded', function () {

  // Open buttons
  var signInBtn   = document.getElementById('signInBtn');
  var registerBtn = document.getElementById('registerBtn');

  if (signInBtn) {
    signInBtn.addEventListener('click', function () {
      authOpenModal('signin');
    });
  }

  if (registerBtn) {
    registerBtn.addEventListener('click', function () {
      authOpenModal('register');
    });
  }

  // Close
  var closeBtn = document.getElementById('authModalClose');
  if (closeBtn) {
    closeBtn.addEventListener('click', authCloseModal);
  }

  var overlay = document.getElementById('authModal');
  if (overlay) {
    overlay.addEventListener('click', function (e) {
      if (e.target === overlay) {
        authCloseModal();
      }
    });
  }

  // Tab switching
  var tabs = document.querySelectorAll('.modal-tab');
  for (var i = 0; i < tabs.length; i++) {
    tabs[i].addEventListener('click', function () {
      setModalMode(this.getAttribute('data-mode'));
    });
  }

  // Sign in
  var siSubmit = document.getElementById('authSiSubmit');
  if (siSubmit) {
    siSubmit.addEventListener('click', function () {
      var email    = document.getElementById('authSiEmail').value.trim();
      var password = document.getElementById('authSiPassword').value;
      var errorEl  = document.getElementById('authSiError');

      if (!email || !password) {
        errorEl.textContent = 'Email and password are required.';
        errorEl.style.display = 'block';
        return;
      }

      errorEl.style.display = 'none';
      siSubmit.disabled = true;
      siSubmit.textContent = 'Signing in…';

      fetch('/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Requested-With': 'XMLHttpRequest'
        },
        body: JSON.stringify({ email: email, password: password })
      })
        .then(function (r) { return r.json(); })
        .then(function (data) {
          if (data.success) {
            authCloseModal();
            window.location.reload();
          } else {
            errorEl.textContent = data.error || 'Sign in failed.';
            errorEl.style.display = 'block';
            siSubmit.disabled = false;
            siSubmit.textContent = 'Sign In';
          }
        })
        .catch(function () {
          errorEl.textContent = 'Something went wrong. Try again.';
          errorEl.style.display = 'block';
          siSubmit.disabled = false;
          siSubmit.textContent = 'Sign In';
        });
    });
  }

  // Register
  var regSubmit = document.getElementById('authRegSubmit');
  if (regSubmit) {
    regSubmit.addEventListener('click', function () {
      var firstName = document.getElementById('authRegFirst').value.trim();
      var lastName  = document.getElementById('authRegLast').value.trim();
      var email     = document.getElementById('authRegEmail').value.trim();
      var password  = document.getElementById('authRegPassword').value;
      var errorEl   = document.getElementById('authRegError');

      if (!firstName || !lastName || !email || !password) {
        errorEl.textContent = 'All fields are required.';
        errorEl.style.display = 'block';
        return;
      }

      errorEl.style.display = 'none';
      regSubmit.disabled = true;
      regSubmit.textContent = 'Creating account…';

      fetch('/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Requested-With': 'XMLHttpRequest'
        },
        body: JSON.stringify({
          firstName: firstName,
          lastName: lastName,
          email: email,
          password: password
        })
      })
        .then(function (r) { return r.json(); })
        .then(function (data) {
          if (data.success) {
            authCloseModal();
            window.location.reload();
          } else {
            errorEl.textContent = data.error || 'Registration failed.';
            errorEl.style.display = 'block';
            regSubmit.disabled = false;
            regSubmit.textContent = 'Create Account';
          }
        })
        .catch(function () {
          errorEl.textContent = 'Something went wrong. Try again.';
          errorEl.style.display = 'block';
          regSubmit.disabled = false;
          regSubmit.textContent = 'Create Account';
        });
    });
  }
});
