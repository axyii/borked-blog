(function () {
  var root = document.documentElement;
  var toggle = document.querySelector('[data-theme-toggle]');
  var label = document.querySelector('[data-theme-label]');
  var themeColor = document.querySelector('meta[name="theme-color"]');
  var systemTheme = window.matchMedia('(prefers-color-scheme: dark)');

  if (!toggle) return;

  function savedTheme() {
    try {
      var saved = localStorage.getItem('borked-theme');
      return saved === 'dark' || saved === 'light' ? saved : null;
    } catch (error) {
      return null;
    }
  }

  function currentTheme() {
    return root.dataset.theme || (systemTheme.matches ? 'dark' : 'light');
  }

  function applyTheme(theme, save) {
    var nextLabel = theme === 'dark' ? 'Light' : 'Dark';
    root.dataset.theme = theme;
    label.textContent = nextLabel;
    toggle.setAttribute('aria-label', 'Switch to ' + nextLabel.toLowerCase() + ' theme');
    toggle.setAttribute('aria-pressed', theme === 'dark' ? 'true' : 'false');
    if (themeColor) themeColor.content = theme === 'dark' ? '#171717' : '#ffffff';

    if (save) {
      try {
        localStorage.setItem('borked-theme', theme);
      } catch (error) {
        // The selected theme still applies for this page view.
      }
    }
  }

  applyTheme(currentTheme(), false);
  window.requestAnimationFrame(function () { root.classList.add('theme-ready'); });

  toggle.addEventListener('click', function () {
    applyTheme(currentTheme() === 'dark' ? 'light' : 'dark', true);
  });

  function followSystemTheme(event) {
    if (!savedTheme()) applyTheme(event.matches ? 'dark' : 'light', false);
  }

  if (systemTheme.addEventListener) {
    systemTheme.addEventListener('change', followSystemTheme);
  } else {
    systemTheme.addListener(followSystemTheme);
  }
}());
