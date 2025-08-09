
document.addEventListener('DOMContentLoaded', function () {
  const form = document.getElementById('contactForm');
  const btn = document.getElementById('submit-btn');
  const messageBox = document.getElementById('formMessage');

  if (!form) return;

  form.addEventListener('submit', async function (e) {
    e.preventDefault();

    // Simple spam honeypot check
    const data = new FormData(form);
    if (data.get('_honey')) {
      // bot detected — do nothing
      return;
    }

    // UI: disable button and show sending text
    btn.disabled = true;
    const originalBtnHtml = btn.innerHTML;
    btn.innerText = 'Sending...';

    try {
      const res = await fetch(form.action, {
        method: 'POST',
        body: data,
        headers: { 'Accept': 'application/json' }
      });

      if (res.ok) {
        showMessage('Message sent! Thank you — I will reply soon.', 'success');
        form.reset();
      } else {
        // try to get JSON error (Formspree returns JSON on errors too)
        let err = {};
        try { err = await res.json(); } catch (ee) { /* ignore */ }
        console.error('Formspree error:', err);
        showMessage('Sorry — there was a problem sending your message. Try again later.', 'error');
      }
    } catch (error) {
      console.error('Network error:', error);
      showMessage('Network error. Please check your connection and try again.', 'error');
    } finally {
      btn.disabled = false;
      btn.innerHTML = originalBtnHtml;

      // hide the message after 6 seconds
      setTimeout(() => {
        hideMessage();
      }, 6000);
    }
  });

  function showMessage(text, type) {
    messageBox.style.display = 'block';
    messageBox.textContent = text;
    messageBox.classList.remove('success', 'error');
    messageBox.classList.add(type);
    // basic inline styling (you can move to CSS)
    messageBox.style.padding = '10px 14px';
    messageBox.style.borderRadius = '6px';
    messageBox.style.fontWeight = '600';
    if (type === 'success') {
      messageBox.style.background = '#e6ffef';
      messageBox.style.color = '#0a6b2f';
      messageBox.style.border = '1px solid rgba(10,107,47,0.12)';
    } else {
      messageBox.style.background = '#fff0f0';
      messageBox.style.color = '#8a1f1f';
      messageBox.style.border = '1px solid rgba(138,31,31,0.12)';
    }
  }

  function hideMessage() {
    messageBox.style.display = 'none';
    messageBox.textContent = '';
    messageBox.classList.remove('success', 'error');
  }
});
