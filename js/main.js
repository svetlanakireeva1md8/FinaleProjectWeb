import { projects } from "./data.js";
import { renderProjects } from "./render.js";
import { openViewer, closeViewer } from "./modal.js";
import { initTheme, toggleTheme } from "./theme.js";
import { saveFilters, loadFilters } from "./storage.js";

// Элементы DOM
const list = document.getElementById("projectsList");
const categoryFilter = document.getElementById("categoryFilter");
const techFilter = document.getElementById("techFilter");
const levelFilter = document.getElementById("levelFilter");
const resetBtn = document.getElementById("resetFilters");
const projectsCount = document.getElementById("projectsCount");
const activeFiltersContainer = document.getElementById("activeFilters");
const activeCount = document.getElementById("activeCount");

// Инициализация темы
initTheme();

// Загружаем сохранённые фильтры
const savedFilters = loadFilters();
categoryFilter.value = savedFilters.category;
techFilter.value = savedFilters.tech;
levelFilter.value = savedFilters.level;

// Функция обновления проектов
function updateProjects() {
  const filters = getCurrentFilters();
  const filtered = filterProjects(projects, filters);
  
  renderProjects(filtered, list);
  updateProjectsCount(filtered.length);
  updateActiveFilters(filters);
  saveFilters(filters);
  
  // Прокрутка к проектам если фильтры изменились
  if (window.scrollY > 300) {
    list.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

// Получение текущих фильтров
function getCurrentFilters() {
  return {
    category: categoryFilter.value,
    tech: techFilter.value,
    level: levelFilter.value
  };
}

// Фильтрация проектов
function filterProjects(projects, filters) {
  return projects.filter(p => {
    const categoryMatch = filters.category === "all" || p.category === filters.category;
    const techMatch = filters.tech === "all" || p.tech.includes(filters.tech);
    const levelMatch = filters.level === "all" || p.level === filters.level;
    
    return categoryMatch && techMatch && levelMatch;
  });
}

// Обновление счетчика проектов
function updateProjectsCount(count) {
  if (projectsCount) {
    projectsCount.textContent = `${count} проект${getCountSuffix(count)}`;
  }
}

function getCountSuffix(count) {
  if (count % 10 === 1 && count % 100 !== 11) return '';
  if ([2, 3, 4].includes(count % 10) && ![12, 13, 14].includes(count % 100)) return 'а';
  return 'ов';
}

// Обновление активных фильтров
function updateActiveFilters(filters) {
  if (!activeFiltersContainer) return;
  
  const activeFilters = [];
  
  if (filters.category !== "all") {
    activeFilters.push({
      type: 'category',
      value: filters.category,
      label: getFilterLabel('category', filters.category)
    });
  }
  
  if (filters.tech !== "all") {
    activeFilters.push({
      type: 'tech',
      value: filters.tech,
      label: getFilterLabel('tech', filters.tech)
    });
  }
  
  if (filters.level !== "all") {
    activeFilters.push({
      type: 'level',
      value: filters.level,
      label: getFilterLabel('level', filters.level)
    });
  }
  
  // Обновляем счетчик
  if (activeCount) {
    activeCount.textContent = activeFilters.length > 0 ? activeFilters.length : '';
    activeCount.style.display = activeFilters.length > 0 ? 'inline-flex' : 'none';
  }
  
  // Рендерим активные фильтры
  if (activeFilters.length > 0) {
    activeFiltersContainer.innerHTML = activeFilters.map(filter => `
      <div class="active-filter">
        <span>${filter.label}</span>
        <button class="active-filter__remove" data-type="${filter.type}" aria-label="Удалить фильтр">
          ×
        </button>
      </div>
    `).join('');
    activeFiltersContainer.style.display = 'flex';
  } else {
    activeFiltersContainer.innerHTML = '';
    activeFiltersContainer.style.display = 'none';
  }
}

// Получение человеко-читаемых названий фильтров
function getFilterLabel(type, value) {
  const labels = {
    category: {
      branding: 'Брендинг',
      poster: 'Постеры',
      ui: 'UI/UX',
      illustration: 'Иллюстрации'
    },
    tech: {
      'Illustrator': 'Adobe Illustrator',
      'Photoshop': 'Adobe Photoshop',
      'Figma': 'Figma',
      'Procreate': 'Procreate',
      'After Effects': 'After Effects'
    },
    level: {
      beginner: 'Начальный',
      intermediate: 'Средний',
      advanced: 'Продвинутый'
    }
  };
  
  return labels[type]?.[value] || value;
}

// Сброс фильтров
function resetFilters() {
  categoryFilter.value = "all";
  techFilter.value = "all";
  levelFilter.value = "all";
  updateProjects();
}

// Удаление конкретного фильтра
function removeFilter(type) {
  switch(type) {
    case 'category':
      categoryFilter.value = "all";
      break;
    case 'tech':
      techFilter.value = "all";
      break;
    case 'level':
      levelFilter.value = "all";
      break;
  }
  updateProjects();
}

// События фильтров
categoryFilter.addEventListener("change", updateProjects);
techFilter.addEventListener("change", updateProjects);
levelFilter.addEventListener("change", updateProjects);

// Событие сброса фильтров
if (resetBtn) {
  resetBtn.addEventListener("click", resetFilters);
}

// Удаление конкретных фильтров
activeFiltersContainer.addEventListener("click", (e) => {
  if (e.target.classList.contains('active-filter__remove')) {
    const type = e.target.dataset.type;
    removeFilter(type);
  }
});

// Обработка клика по карточке проекта
list.addEventListener("click", e => {
  const card = e.target.closest(".card");
  if (!card) return;

  const project = projects.find(p => p.id == card.dataset.id);
  if (project) {
    openViewer(project);
  }
});

// Обработка кнопки в пустом состоянии
list.addEventListener("click", (e) => {
  if (e.target.id === "resetEmpty") {
    resetFilters();
  }
});

// Закрытие модального окна
document.getElementById("closeViewer").onclick = closeViewer;
document.getElementById("themeToggle").onclick = toggleTheme;

// Закрытие по клику вне контента
document.getElementById("viewer").addEventListener("click", (e) => {
  if (e.target.id === "viewer") {
    closeViewer();
  }
});

// Закрытие по Escape
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    closeViewer();
  }
});

// Плавная навигация по якорям
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const targetId = this.getAttribute('href');
    if (targetId === '#') return;
    
    const targetElement = document.querySelector(targetId);
    if (targetElement) {
      targetElement.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  });
});

// Первоначальный рендер
updateProjects();

// Мобильное меню
const mobileMenuToggle = document.getElementById('mobileMenuToggle');
const mobileMenu = document.getElementById('mobileMenu');
const mobileThemeToggle = document.getElementById('mobileThemeToggle');

if (mobileMenuToggle && mobileMenu) {
  mobileMenuToggle.addEventListener('click', () => {
    const isExpanded = mobileMenuToggle.getAttribute('aria-expanded') === 'true';
    mobileMenuToggle.setAttribute('aria-expanded', !isExpanded);
    mobileMenu.setAttribute('aria-hidden', isExpanded);
    mobileMenu.classList.toggle('active');
    document.body.style.overflow = isExpanded ? 'auto' : 'hidden';
  });

  // Закрытие меню по клику на ссылку
  mobileMenu.querySelectorAll('.mobile-menu__link').forEach(link => {
    link.addEventListener('click', () => {
      mobileMenuToggle.setAttribute('aria-expanded', 'false');
      mobileMenu.setAttribute('aria-hidden', 'true');
      mobileMenu.classList.remove('active');
      document.body.style.overflow = 'auto';
    });
  });

  // Переключение темы из мобильного меню
  if (mobileThemeToggle) {
    mobileThemeToggle.addEventListener('click', () => {
      toggleTheme();
    });
  }
}

// Закрытие меню при ресайзе
window.addEventListener('resize', () => {
  if (window.innerWidth >= 640 && mobileMenu) {
    mobileMenuToggle.setAttribute('aria-expanded', 'false');
    mobileMenu.setAttribute('aria-hidden', 'true');
    mobileMenu.classList.remove('active');
    document.body.style.overflow = 'auto';
  }
});