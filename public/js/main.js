document.addEventListener('DOMContentLoaded', function () {
  // Hero search
  var input = document.getElementById('heroSearch');
  var btn = document.getElementById('heroSearchBtn');

  function doSearch() {
    var q = input ? input.value.trim() : '';
    if (q) {
      window.location.href = `/buildings?search=${encodeURIComponent(q)}`;
    } else {
      window.location.href = '/buildings';
    }
  }

  if (btn) {
    btn.addEventListener('click', doSearch);
  }

  if (input) {
    input.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') {
        doSearch();
      }
    });
  }

  // Contact form
  var form = document.getElementById('contactForm');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();

      var firstName = document.getElementById('contactFirst').value.trim();
      var lastName  = document.getElementById('contactLast').value.trim();
      var email     = document.getElementById('contactEmail').value.trim();
      var subject   = document.getElementById('contactSubject').value;
      var message   = document.getElementById('contactMessage').value.trim();
      var msgEl     = document.getElementById('contactMsg');
      var submitBtn = document.getElementById('contactSubmit');

      if (!firstName || !lastName || !email || !message) {
        msgEl.textContent = 'Please fill in all required fields.';
        msgEl.style.display = 'block';
        msgEl.style.background = 'rgba(248,113,113,0.12)';
        msgEl.style.color = 'var(--danger)';
        return;
      }

      submitBtn.disabled = true;
      submitBtn.textContent = 'Sending…';

      fetch('/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ firstName, lastName, email, subject, message })
      })
        .then(function (r) { return r.json(); })
        .then(function (data) {
          if (data.success) {
            form.reset();
            msgEl.textContent = "Message sent! We'll get back to you soon.";
            msgEl.style.display = 'block';
            msgEl.style.background = 'rgba(74,222,128,0.12)';
            msgEl.style.color = 'var(--success)';
          } else {
            msgEl.textContent = data.error || 'Something went wrong.';
            msgEl.style.display = 'block';
            msgEl.style.background = 'rgba(248,113,113,0.12)';
            msgEl.style.color = 'var(--danger)';
          }
        })
        .catch(function () {
          msgEl.textContent = 'Something went wrong. Please try again.';
          msgEl.style.display = 'block';
          msgEl.style.background = 'rgba(248,113,113,0.12)';
          msgEl.style.color = 'var(--danger)';
        })
        .finally(function () {
          submitBtn.disabled = false;
          submitBtn.textContent = 'Send Message';
        });
    });
  }
});
