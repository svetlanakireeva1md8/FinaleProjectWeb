export function openViewer(project) {
  const title = document.getElementById("viewerTitle");
  const description = document.getElementById("viewerDescription");
  const gallery = document.getElementById("viewerGallery");
  
  title.textContent = project.title;
  
  description.innerHTML = `
    <p>${project.description}</p>
    <div class="project-meta">
      <span><strong>Направление:</strong> ${project.category}</span>
      <span><strong>Технологии:</strong> ${project.tech}</span>
      <span><strong>Сложность:</strong> ${project.level}</span>
      <span><strong>Год:</strong> ${project.year}</span>
    </div>
  `;
  
  gallery.innerHTML = "";
  
  project.images.forEach((src, index) => {
    const imgContainer = document.createElement("div");
    imgContainer.className = "viewer__image";
    
    const img = document.createElement("img");
    img.src = src;
    img.alt = `${project.title} - изображение ${index + 1}`;
    img.loading = "lazy";
    
    const caption = document.createElement("p");
    caption.className = "viewer__caption";
    caption.textContent = `Изображение ${index + 1}`;
    
    imgContainer.appendChild(img);
    imgContainer.appendChild(caption);
    gallery.appendChild(imgContainer);
  });
  
  document.getElementById("viewer").classList.add("active");
  document.body.style.overflow = "hidden"; // Блокируем скролл
}

export function closeViewer() {
  document.getElementById("viewer").classList.remove("active");
  document.body.style.overflow = "auto"; // Восстанавливаем скролл
}