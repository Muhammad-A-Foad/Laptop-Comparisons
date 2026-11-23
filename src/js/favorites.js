import { loadLaptops } from './api.js';
import { getFavorites, clearFavorites } from './storage.js';
import { setupHeader, renderLaptopCard, attachFavoriteButtons, formatPrice, errorBox } from './ui.js';

setupHeader();

const grid = document.getElementById('favorites-grid');
const emptyMessage = document.getElementById('empty-message');
const countLabel = document.getElementById('fav-count');
const totalLabel = document.getElementById('fav-total');
const averageLabel = document.getElementById('fav-average');

try {
  const laptops = await loadLaptops();

  const renderFavorites = () => {
    const favoriteIds = getFavorites();
    const savedLaptops = laptops.filter((laptop) => favoriteIds.includes(laptop.id));

    const total = savedLaptops.reduce((sum, laptop) => sum + laptop.price, 0);
    const average = savedLaptops.length === 0 ? 0 : total / savedLaptops.length;

    countLabel.textContent = savedLaptops.length;
    totalLabel.textContent = formatPrice(total);
    averageLabel.textContent = savedLaptops.length === 0 ? '-' : formatPrice(Math.round(average));

    if (savedLaptops.length === 0) {
      grid.innerHTML = '';
      emptyMessage.classList.remove('hidden');
    } else {
      emptyMessage.classList.add('hidden');
      grid.innerHTML = savedLaptops.map(renderLaptopCard).join('');
    }
  };

  attachFavoriteButtons(grid, renderFavorites);

  document.getElementById('clear-button').addEventListener('click', () => {
    clearFavorites();
    renderFavorites();
  });

  renderFavorites();
} catch (error) {
  grid.innerHTML = errorBox(
    'We could not load the laptop data. Please run the site from a local server like VS Code Live Server and try again.'
  );
}
