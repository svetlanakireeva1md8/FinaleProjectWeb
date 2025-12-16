export const filterProjects = (projects, filters) =>
  projects.filter(p =>
    (filters.category === "all" || p.category === filters.category) &&
    (filters.tech === "all" || p.tech === filters.tech) &&
    (filters.level === "all" || p.level === filters.level)
  );