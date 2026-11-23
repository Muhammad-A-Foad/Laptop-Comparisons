const FAVORITES_KEY = 'laptop-favorites';
const THEME_KEY = 'laptop-theme';

const getFavorites = () => {
  const saved = localStorage.getItem(FAVORITES_KEY);
  if (!saved) {
    return [];
  }
  try {
    return JSON.parse(saved);
  } catch (error) {
    return [];
  }
};

const saveFavorites = (ids) => {
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(ids));
};

const isFavorite = (id) => {
  return getFavorites().includes(id);
};

const toggleFavorite = (id) => {
  const ids = getFavorites();
  if (ids.includes(id)) {
    const remaining = ids.filter((item) => item !== id);
    saveFavorites(remaining);
    return false;
  }
  ids.push(id);
  saveFavorites(ids);
  return true;
};

const clearFavorites = () => {
  saveFavorites([]);
};

const getTheme = () => {
  const saved = localStorage.getItem(THEME_KEY);
  if (saved === 'battery') {
    return 'battery';
  }
  return 'performance';
};

const setTheme = (theme) => {
  localStorage.setItem(THEME_KEY, theme);
};

const applyTheme = (theme) => {
  document.documentElement.setAttribute('data-theme', theme);
};

export { getFavorites, isFavorite, toggleFavorite, clearFavorites, getTheme, setTheme, applyTheme };
