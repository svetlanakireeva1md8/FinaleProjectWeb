const KEY = "theme";

export function initTheme() {
    const saved = localStorage.getItem(KEY) || "light";
    document.documentElement.dataset.theme = saved;
    updateThemeToggle(saved);
}

export function toggleTheme() {
    const current = document.documentElement.dataset.theme;
    const next = current === "dark" ? "light" : "dark";
    
    // Добавляем класс анимации для кнопки
    const themeToggle = document.getElementById('themeToggle');
    const mobileThemeToggle = document.getElementById('mobileThemeToggle');
    
    if (themeToggle) themeToggle.classList.add('animating');
    if (mobileThemeToggle) mobileThemeToggle.classList.add('animating');
    
    // Меняем тему
    document.documentElement.dataset.theme = next;
    localStorage.setItem(KEY, next);
    
    // Обновляем состояние кнопок
    updateThemeToggle(next);
    
    // Убираем класс анимации после завершения
    setTimeout(() => {
        if (themeToggle) themeToggle.classList.remove('animating');
        if (mobileThemeToggle) mobileThemeToggle.classList.remove('animating');
    }, 600);
}

// Функция для обновления состояния всех кнопок переключения темы
function updateThemeToggle(theme) {
    const themeToggles = document.querySelectorAll('#themeToggle, #mobileThemeToggle');
    
    themeToggles.forEach(toggle => {
        if (!toggle) return;
        
        const icon = toggle.querySelector('.theme-toggle__icon');
        if (!icon) return;
        
        // Сбрасываем трансформации
        icon.style.transform = '';
        
        // Обновляем aria-label
        const nextTheme = theme === 'dark' ? 'светлую' : 'темную';
        toggle.setAttribute('aria-label', `Переключить на ${nextTheme} тему`);
        toggle.setAttribute('title', `Включить ${nextTheme} тему`);
    });
}