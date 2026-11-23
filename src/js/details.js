import { loadLaptops, getLaptopById } from './api.js';
import { isFavorite, toggleFavorite } from './storage.js';
import { addToCompare } from './compare.js';
import { setupHeader, formatPrice, updateFavoriteButtons, errorBox } from './ui.js';

setupHeader();

const container = document.getElementById('details-container');

const params = new URLSearchParams(window.location.search);
const id = Number(params.get('id'));

const showMissingMessage = () => {
  container.innerHTML = errorBox(
    'We could not find that laptop. It may be an old link. ' +
      '<a href="laptops.html" class="text-app-accent hover:underline">Back to the catalogue</a>'
  );
};

try {
  const laptops = await loadLaptops();
  const laptop = getLaptopById(laptops, id);

  if (!laptop) {
    showMissingMessage();
  } else {
    const specs = [
      { label: 'Price', value: formatPrice(laptop.price) },
      { label: 'Brand', value: laptop.brand },
      { label: 'Category', value: laptop.category },
      { label: 'Processor', value: laptop.cpu },
      { label: 'Memory', value: laptop.ramGB + ' GB RAM' },
      { label: 'Storage', value: laptop.storageGB + ' GB' },
      { label: 'Battery life', value: laptop.batteryHours + ' hours' },
      { label: 'Weight', value: laptop.weightKg + ' kg' },
      { label: 'Screen', value: laptop.screenInches + ' inches' }
    ];

    const specRows = specs
      .map(
        (spec) =>
          '<tr class="border-b border-app-border">' +
          '<th scope="row" class="py-2 pr-4 text-left font-semibold text-app-muted">' +
          spec.label +
          '</th>' +
          '<td class="py-2">' +
          spec.value +
          '</td>' +
          '</tr>'
      )
      .join('');

    const saved = isFavorite(laptop.id);
    const favoriteClasses = saved ? 'btn-action btn-primary fav-btn' : 'btn-action btn-outline fav-btn';
    const favoriteText = saved ? '♥ Saved' : '♡ Save';

    container.innerHTML = `
      <a href="laptops.html" class="text-app-muted hover:text-app-accent">← Back to laptops</a>
      <div class="mt-4 grid grid-cols-1 gap-8 lg:grid-cols-2">
        <div>
          <img src="${laptop.image}" alt="${laptop.name}" class="w-full rounded-xl border border-app-border object-cover">
          <h2 class="mt-6 text-lg font-bold">Full specifications</h2>
          <table class="mt-3 w-full text-sm">
            <tbody>${specRows}</tbody>
          </table>
        </div>
        <div>
          <p class="text-app-muted">${laptop.brand}</p>
          <h1 class="text-2xl font-bold sm:text-3xl">${laptop.name}</h1>
          <p class="mt-3 inline-block rounded-full bg-app-border px-3 py-1 text-sm">${laptop.category}</p>
          <p class="mt-4 text-3xl font-bold text-app-accent">${formatPrice(laptop.price)}</p>
          <p class="mt-4 leading-relaxed text-app-muted">${laptop.description}</p>
          <div class="mt-6 flex flex-wrap gap-3">
            <button id="favorite-button" class="${favoriteClasses}" data-id="${laptop.id}">${favoriteText}</button>
            <button id="compare-button" class="btn-action btn-primary">Add to compare</button>
          </div>
          <p id="compare-message" class="mt-3 text-sm text-app-accent"></p>
        </div>
      </div>
    `;

    document.getElementById('favorite-button').addEventListener('click', () => {
      toggleFavorite(laptop.id);
      updateFavoriteButtons(laptop.id);
    });

    document.getElementById('compare-button').addEventListener('click', () => {
      if (!isFavorite(laptop.id)) {
        toggleFavorite(laptop.id);
        updateFavoriteButtons(laptop.id);
      }
      const result = addToCompare(laptop.id);
      document.getElementById('compare-message').textContent = result.message;
    });
  }
} catch (error) {
  container.innerHTML = errorBox(
    'We could not load the laptop data. Please run the site from a local server like VS Code Live Server and try again.'
  );
}
