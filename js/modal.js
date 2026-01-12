export function openViewer(project) {
  const viewer = document.getElementById("viewer");
  const title = document.getElementById("viewerTitle");
  const description = document.getElementById("viewerDescription");
  const gallery = document.getElementById("viewerGallery");

  // 1️⃣ СНАЧАЛА устанавливаем контент БЕЗ показа
  title.textContent = project.title;

  // 2️⃣ Описание и мета
  description.innerHTML = `
    <p>${project.description}</p>
    <div class="project-meta">
      <span><strong>Направление:</strong> ${getCategoryLabel(project.category)}</span>
      <span><strong>Технологии:</strong> ${project.tech}</span>
      <span><strong>Сложность:</strong> ${getLevelLabel(project.level)}</span>
      <span><strong>Год:</strong> ${project.year}</span>
    </div>
  `;

  // 3️⃣ Очищаем и заполняем галерею ПОЛНОСТЬЮ ДО показа
  gallery.innerHTML = "";

  project.images.forEach((src, index) => {
    const imgContainer = document.createElement("div");
    imgContainer.className = "viewer__image";

    const img = document.createElement("img");
    img.alt = `${project.title} — изображение ${index + 1}`;
    img.loading = "eager"; // 🔑 Важно для мобильных
    img.src = src;

    // Предзагрузка для мобильных
    const imgPreload = new Image();
    imgPreload.src = src;
    imgPreload.onload = () => {
      img.src = src;
    };

    img.onerror = () => {
      console.warn(`Не удалось загрузить изображение: ${src}`);
      img.style.backgroundColor = "var(--card)";
      img.style.minHeight = "200px";
      img.style.display = "flex";
      img.style.alignItems = "center";
      img.style.justifyContent = "center";
      img.innerHTML = `<span style="color: var(--text); opacity: 0.5;">Изображение ${index + 1}</span>`;
    };

    const caption = document.createElement("p");
    caption.className = "viewer__caption";
    caption.textContent = `Изображение ${index + 1}`;

    imgContainer.appendChild(img);
    imgContainer.appendChild(caption);
    gallery.appendChild(imgContainer);
  });

  // 4️⃣ ТОЛЬКО ПОСЛЕ создания всего контента показываем модалку
  setTimeout(() => {
    viewer.classList.add("active");
    document.body.style.overflow = "hidden";
  }, 50);
}

export function closeViewer() {
  const viewer = document.getElementById("viewer");
  viewer.classList.remove("active");
  document.body.style.overflow = "auto";
}

// Вспомогательные функции для преобразования категорий
function getCategoryLabel(category) {
  const labels = {
    branding: 'Брендинг',
    poster: 'Постеры',
    ui: 'UI/UX',
    illustration: 'Иллюстрации'
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