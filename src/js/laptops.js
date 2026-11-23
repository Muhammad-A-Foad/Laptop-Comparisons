import { loadLaptops } from './api.js';
import { setupHeader, renderLaptopCard, showSkeletons, attachFavoriteButtons, errorBox, formatPrice } from './ui.js';

setupHeader();

const grid = document.getElementById('laptop-grid');
const resultCount = document.getElementById('result-count');
const emptyMessage = document.getElementById('empty-message');

attachFavoriteButtons(grid);

showSkeletons(grid, 6);

try {
  const laptops = await loadLaptops();

  const searchInput = document.getElementById('search-input');
  const categorySelect = document.getElementById('category-select');
  const priceRange = document.getElementById('price-range');
  const priceLabel = document.getElementById('price-label');
  const ramSelect = document.getElementById('ram-select');
  const sortSelect = document.getElementById('sort-select');

  const sortFields = {
    price: 'price',
    battery: 'batteryHours',
    weight: 'weightKg'
  };

  const renderLaptops = () => {
    const search = searchInput.value.trim().toLowerCase();
    const category = categorySelect.value;
    const maxPrice = Number(priceRange.value);
    const minRam = Number(ramSelect.value);

    const filtered = laptops.filter((laptop) => {
      const matchesSearch =
        laptop.name.toLowerCase().includes(search) ||
        laptop.brand.toLowerCase().includes(search);
      const matchesCategory = category === 'all' || laptop.category === category;
      const matchesPrice = laptop.price <= maxPrice;
      const matchesRam = laptop.ramGB >= minRam;
      return matchesSearch && matchesCategory && matchesPrice && matchesRam;
    });

    const parts = sortSelect.value.split('-');
    const sortKey = sortFields[parts[0]];
    const sortDirection = parts[1];

    const sorted = [...filtered].sort((a, b) => {
      const difference = a[sortKey] - b[sortKey];
      if (sortDirection === 'asc') {
        return difference;
      }
      return -difference;
    });

    grid.innerHTML = sorted.map(renderLaptopCard).join('');
    resultCount.textContent = 'Showing ' + sorted.length + ' of ' + laptops.length + ' laptops';
    emptyMessage.classList.toggle('hidden', sorted.length > 0);
  };

  searchInput.addEventListener('input', renderLaptops);
  categorySelect.addEventListener('change', renderLaptops);
  ramSelect.addEventListener('change', renderLaptops);
  sortSelect.addEventListener('change', renderLaptops);
  priceRange.addEventListener('input', () => {
    priceLabel.textContent = 'Up to ' + formatPrice(Number(priceRange.value));
    renderLaptops();
  });

  renderLaptops();
} catch (error) {
  grid.innerHTML = errorBox('We could not load the laptops. Please run the site from a local server like VS Code Live Server and try again.');
  resultCount.textContent = '';
}
