import { loadLaptops } from './api.js';
import { getFavorites } from './storage.js';
import { setupHeader, formatPrice } from './ui.js';

setupHeader();

try {
  const laptops = await loadLaptops();

  const stats = laptops.reduce(
    (result, laptop) => {
      result.count = result.count + 1;
      result.lowest = Math.min(result.lowest, laptop.price);
      return result;
    },
    { count: 0, lowest: Infinity }
  );

  document.getElementById('stat-total').textContent = stats.count;
  document.getElementById('stat-lowest').textContent =
    stats.lowest === Infinity ? '-' : formatPrice(stats.lowest);
  document.getElementById('stat-favorites').textContent = getFavorites().length;

  document.getElementById('link-details').href = 'details.html?id=' + laptops[0].id;
} catch (error) {
  document.getElementById('stat-total').textContent = '-';
  document.getElementById('stat-lowest').textContent = '-';
  document.getElementById('stat-favorites').textContent = '-';
  document.getElementById('home-error').classList.remove('hidden');
}
