document.addEventListener('DOMContentLoaded', () => {
  const sections = document.querySelectorAll('.newsletter');

  sections.forEach((section) => {
    const input = section.querySelector('input');
    const button = section.querySelector('button');

    if (!button) {
      return;
    }

    const originalText = button.textContent && button.textContent.trim() ? button.textContent.trim() : 'Subscribe';
    let resetTimeout = null;

    let statusMessage = section.querySelector('.newsletter-status');
    if (!statusMessage) {
      statusMessage = document.createElement('p');
      statusMessage.className = 'newsletter-status';
      statusMessage.style.marginTop = '0.75rem';
      statusMessage.style.fontSize = '0.9rem';
      statusMessage.style.color = 'var(--accent-red)';
      statusMessage.style.fontWeight = '600';
      statusMessage.style.textAlign = 'center';
      statusMessage.style.opacity = '0';
      statusMessage.style.transition = 'opacity 0.2s ease';
      statusMessage.style.pointerEvents = 'none';
      section.appendChild(statusMessage);
    }

    const showPlaceholder = () => {
      if (input) {
        input.value = '';
        input.blur();
      }

      statusMessage.textContent = 'Newsletter signup is under development. Please check back soon.';
      statusMessage.style.opacity = '1';

      button.textContent = 'Coming Soon';
      button.disabled = true;

      if (resetTimeout) {
        clearTimeout(resetTimeout);
      }
      resetTimeout = window.setTimeout(() => {
        statusMessage.style.opacity = '0';
        button.textContent = originalText;
        button.disabled = false;
      }, 3000);
    };

    button.addEventListener('click', (event) => {
      event.preventDefault();
      showPlaceholder();
    });

    section.addEventListener('submit', (event) => {
      event.preventDefault();
      showPlaceholder();
    });
  });
});
