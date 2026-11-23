import { loadLaptops } from './api.js';
import { getFavorites } from './storage.js';
import { getCompareIds, saveCompareIds, addToCompare, removeFromCompare, findBestLaptop } from './compare.js';
import { setupHeader, formatPrice, errorBox } from './ui.js';

setupHeader();

const picker = document.getElementById('compare-picker');
const tableArea = document.getElementById('compare-table');
const message = document.getElementById('compare-message');

try {
  const laptops = await loadLaptops();
  const favoriteIds = getFavorites();
  const favoriteLaptops = laptops.filter((laptop) => favoriteIds.includes(laptop.id));

  let selectedIds = getCompareIds().filter((id) => favoriteIds.includes(id));
  if (selectedIds.length === 0 && favoriteLaptops.length > 0) {
    selectedIds = favoriteLaptops.slice(0, 4).map((laptop) => laptop.id);
  }
  saveCompareIds(selectedIds);

  const specRows = [
    { label: 'Price', get: (laptop) => laptop.price, best: 'low', text: (laptop) => formatPrice(laptop.price) },
    { label: 'Brand', get: (laptop) => laptop.brand, best: null, text: (laptop) => laptop.brand },
    { label: 'Category', get: (laptop) => laptop.category, best: null, text: (laptop) => laptop.category },
    { label: 'Processor', get: (laptop) => laptop.cpu, best: null, text: (laptop) => laptop.cpu },
    { label: 'RAM', get: (laptop) => laptop.ramGB, best: 'high', text: (laptop) => laptop.ramGB + ' GB' },
    { label: 'Storage', get: (laptop) => laptop.storageGB, best: 'high', text: (laptop) => laptop.storageGB + ' GB' },
    { label: 'Battery life', get: (laptop) => laptop.batteryHours, best: 'high', text: (laptop) => laptop.batteryHours + ' hours' },
    { label: 'Weight', get: (laptop) => laptop.weightKg, best: 'low', text: (laptop) => laptop.weightKg + ' kg' },
    { label: 'Screen', get: (laptop) => laptop.screenInches, best: null, text: (laptop) => laptop.screenInches + ' inches' }
  ];

  const renderPicker = () => {
    if (favoriteLaptops.length === 0) {
      picker.innerHTML =
        'You have no favorites yet. <a href="laptops.html" class="text-app-accent hover:underline">Browse laptops</a> and save some first.';
      return;
    }
    picker.innerHTML = favoriteLaptops
      .map((laptop) => {
        const active = selectedIds.includes(laptop.id);
        const classes = active ? 'btn-action btn-primary pick-btn' : 'btn-action btn-outline pick-btn';
        const check = active ? '✓ ' : '';
        return `<button class="${classes}" data-id="${laptop.id}">${check}${laptop.name}</button>`;
      })
      .join('');
  };

  const renderTable = () => {
    const chosen = selectedIds
      .map((id) => laptops.find((laptop) => laptop.id === id))
      .filter((laptop) => laptop !== undefined);

    if (chosen.length < 2) {
      tableArea.innerHTML =
        '<div class="rounded-xl border border-app-border bg-app-card p-8 text-center text-app-muted">Pick at least two laptops to compare.</div>';
      return;
    }

    const headerCells = chosen
      .map(
        (laptop) => `
          <th class="border border-app-border p-3 align-top">
            <img src="${laptop.image}" alt="${laptop.name}" class="mx-auto h-20 w-28 rounded-lg object-cover">
            <p class="mt-2 font-bold">${laptop.name}</p>
            <p class="text-sm font-normal text-app-muted">${laptop.brand}</p>
            <p class="text-sm font-bold text-app-accent">${formatPrice(laptop.price)}</p>
            <button class="btn-action btn-outline mt-2 remove-btn" data-id="${laptop.id}">Remove</button>
          </th>`
      )
      .join('');

    const bodyRows = specRows
      .map((row) => {
        const cells = chosen
          .map((laptop) => {
            let cellClass = '';
            if (row.best) {
              const bestLaptop = findBestLaptop(chosen, row.get, row.best);
              if (bestLaptop.id === laptop.id) {
                cellClass = 'bg-app-accent font-bold text-app-accent-text';
              }
            }
            return `<td class="border border-app-border p-3 text-center ${cellClass}">${row.text(laptop)}</td>`;
          })
          .join('');
        return `<tr><th scope="row" class="border border-app-border bg-app-card p-3 text-left">${row.label}</th>${cells}</tr>`;
      })
      .join('');

    tableArea.innerHTML = `
      <div class="overflow-x-auto rounded-xl border border-app-border bg-app-card p-2">
        <table class="w-full min-w-[640px] border-collapse text-sm">
          <thead>
            <tr><th class="border border-app-border bg-app-card p-3 text-left"></th>${headerCells}</tr>
          </thead>
          <tbody>${bodyRows}</tbody>
        </table>
      </div>
      <p class="mt-3 text-sm text-app-muted">Highlighted cells show the best value in each row.</p>
    `;
  };

  const renderAll = () => {
    renderPicker();
    renderTable();
  };

  picker.addEventListener('click', (event) => {
    const button = event.target.closest('.pick-btn');
    if (!button) {
      return;
    }
    const id = Number(button.dataset.id);
    if (selectedIds.includes(id)) {
      removeFromCompare(id);
      message.textContent = '';
    } else {
      const result = addToCompare(id);
      if (result.ok) {
        message.textContent = '';
      } else {
        message.textContent = result.message;
      }
    }
    selectedIds = getCompareIds();
    renderAll();
  });

  tableArea.addEventListener('click', (event) => {
    const button = event.target.closest('.remove-btn');
    if (!button) {
      return;
    }
    removeFromCompare(Number(button.dataset.id));
    selectedIds = getCompareIds();
    message.textContent = '';
    renderAll();
  });

  renderAll();
} catch (error) {
  picker.innerHTML = '';
  tableArea.innerHTML = errorBox(
    'We could not load the laptop data. Please run the site from a local server like VS Code Live Server and try again.'
  );
}
