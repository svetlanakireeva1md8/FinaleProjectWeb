const FILTERS_KEY = "projectFilters";

export function saveFilters(filters) {
  localStorage.setItem(FILTERS_KEY, JSON.stringify(filters));
}

export function loadFilters() {
  const saved = localStorage.getItem(FILTERS_KEY);
  return saved ? JSON.parse(saved) : {
    category: "all",
    tech: "all",
    level: "all"
  };
}