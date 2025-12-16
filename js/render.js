export function renderProjects(projects, container) {
  container.innerHTML = '';
  
  if (projects.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <div class="empty-state__icon">🔍</div>
        <h3 class="empty-state__title">Проекты не найдены</h3>
        <p class="empty-state__text">Попробуйте изменить параметры фильтрации или сбросить фильтры</p>
        <button id="resetEmpty" class="btn">
          <span>Показать все проекты</span>
          <span>→</span>
        </button>
      </div>
    `;
    return;
  }
  
  projects.forEach((p, index) => {
    const li = document.createElement('li');
    li.className = 'card';
    li.dataset.id = p.id;
    li.style.animationDelay = `${index * 0.1}s`;
    li.innerHTML = `
      <div class="card__header">
        <span class="card__badge card__badge--${p.category}">${getCategoryLabel(p.category)}</span>
        <span class="card__year">${p.year}</span>
      </div>
      <div class="card__content">
        <h3 class="card__title">${p.title}</h3>
        <div class="card__tech">
          <span class="card__tech-tools">${p.tech.split(', ')[0]}</span>
          <span class="card__level card__level--${p.level}">${getLevelLabel(p.level)}</span>
        </div>
        <p class="card__preview">${p.description.substring(0, 120)}${p.description.length > 120 ? '...' : ''}</p>
      </div>
      <div class="card__footer">
        <button class="card__btn">
          <span>Подробнее</span>
          <span>→</span>
        </button>
      </div>
    `;
    container.appendChild(li);
  });
}

function getCategoryLabel(category) {
  const labels = {
    branding: 'Брендинг',
    poster: 'Постер',
    ui: 'UI/UX',
    illustration: 'Иллюстрация'
  };
  return labels[category] || category;
}

function getLevelLabel(level) {
  const labels = {
    beginner: 'Начинающий',
    intermediate: 'Средний',
    advanced: 'Продвинутый'
  };
  return labels[level] || level;
}
