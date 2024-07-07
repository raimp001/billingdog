document.addEventListener("DOMContentLoaded", function() {
    const themeToggleBtn = document.getElementById('theme-toggle');
    const themeStylesheet = document.getElementById('theme-stylesheet');

    themeToggleBtn.addEventListener('click', () => {
        if (themeStylesheet.getAttribute('href') === 'dark-mode.css') {
            themeStylesheet.setAttribute('href', 'light-mode.css');
            themeToggleBtn.textContent = 'Switch to Dark Mode';
        } else {
            themeStylesheet.setAttribute('href', 'dark-mode.css');
            themeToggleBtn.textContent = 'Switch to Light Mode';
        }
    });
});

