const KEY = "theme";

export function initTheme() {
  const saved = localStorage.getItem(KEY) || "light";
  document.documentElement.dataset.theme = saved;
}

export function toggleTheme() {
  const current = document.documentElement.dataset.theme;
  const next = current === "dark" ? "light" : "dark";
  document.documentElement.dataset.theme = next;
  localStorage.setItem(KEY, next);
}
