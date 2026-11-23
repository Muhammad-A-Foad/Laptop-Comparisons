import { isFavorite, toggleFavorite, getTheme, setTheme, applyTheme } from './storage.js';

const formatPrice = (price) => {
  return '$' + price.toLocaleString('en-US');
};

const errorBox = (text) => {
  return '<div class="rounded-xl border border-app-border bg-app-card p-6 text-center text-app-muted">' + text + '</div>';
};

const renderLaptopCard = (laptop) => {
  const saved = isFavorite(laptop.id);
  const buttonClasses = saved ? 'btn-action btn-primary fav-btn' : 'btn-action btn-outline fav-btn';
  const buttonText = saved ? '♥ Saved' : '♡ Save';

  return `
    <article class="laptop-card">
      <a href="details.html?id=${laptop.id}" class="block overflow-hidden rounded-lg">
        <img src="${laptop.image}" alt="${laptop.name}" class="h-40 w-full object-cover transition duration-200 hover:scale-105">
      </a>
      <div class="flex items-start justify-between gap-2">
        <div>
          <p class="text-sm text-app-muted">${laptop.brand}</p>
          <h3 class="font-bold">
            <a href="details.html?id=${laptop.id}" class="hover:text-app-accent">${laptop.name}</a>
          </h3>
        </div>
        <span class="rounded-full bg-app-border px-2 py-1 text-xs">${laptop.category}</span>
      </div>
      <p class="text-lg font-bold text-app-accent">${formatPrice(laptop.price)}</p>
      <ul class="flex flex-wrap gap-x-3 gap-y-1 text-sm text-app-muted">
        <li>${laptop.ramGB} GB RAM</li>
        <li>${laptop.storageGB} GB storage</li>
        <li>${laptop.batteryHours} h battery</li>
        <li>${laptop.weightKg} kg</li>
        <li>${laptop.screenInches}"</li>
      </ul>
      <div class="mt-auto flex gap-2">
        <a href="details.html?id=${laptop.id}" class="btn-action btn-primary flex-1">Details</a>
        <button class="${buttonClasses}" data-id="${laptop.id}">${buttonText}</button>
      </div>
    </article>
  `;
};

const showSkeletons = (container, count) => {
  let cards = '';
  for (let i = 0; i < count; i++) {
    cards += `
      <div class="skeleton-card">
        <div class="h-40 w-full animate-pulse rounded-lg bg-app-border"></div>
        <div class="mt-4 h-4 w-2/3 animate-pulse rounded bg-app-border"></div>
        <div class="mt-2 h-4 w-1/2 animate-pulse rounded bg-app-border"></div>
        <div class="mt-4 h-4 w-full animate-pulse rounded bg-app-border"></div>
        <div class="mt-4 h-10 w-full animate-pulse rounded-lg bg-app-border"></div>
      </div>
    `;
  }
  container.innerHTML = cards;
};

const updateFavoriteButtons = (id) => {
  const saved = isFavorite(id);
  const buttons = document.querySelectorAll('.fav-btn[data-id="' + id + '"]');
  buttons.forEach((button) => {
    button.textContent = saved ? '♥ Saved' : '♡ Save';
    button.classList.toggle('btn-primary', saved);
    button.classList.toggle('btn-outline', !saved);
  });
};

const attachFavoriteButtons = (container, afterToggle) => {
  container.addEventListener('click', (event) => {
    const button = event.target.closest('.fav-btn');
    if (!button) {
      return;
    }
    const id = Number(button.dataset.id);
    toggleFavorite(id);
    updateFavoriteButtons(id);
    if (afterToggle) {
      afterToggle();
    }
  });
};

const setupHeader = () => {
  applyTheme(getTheme());

  const navToggle = document.getElementById('nav-toggle');
  const navMenu = document.getElementById('nav-menu');
  navToggle.addEventListener('click', () => {
    navMenu.classList.toggle('hidden');
    navMenu.classList.toggle('flex');
  });

  const pageName = window.location.pathname.split('/').pop() || 'index.html';
  const links = navMenu.querySelectorAll('a');
  links.forEach((link) => {
    const linkName = link.getAttribute('href');
    if (linkName === pageName) {
      link.classList.add('font-bold', 'text-app-accent');
    }
  });

  const themeToggle = document.getElementById('theme-toggle');
  const showThemeLabel = () => {
    if (getTheme() === 'battery') {
      themeToggle.textContent = 'Battery Saver Mode';
    } else {
      themeToggle.textContent = 'Performance Mode';
    }
  };
  showThemeLabel();

  themeToggle.addEventListener('click', () => {
    if (getTheme() === 'performance') {
      setTheme('battery');
      applyTheme('battery');
    } else {
      setTheme('performance');
      applyTheme('performance');
    }
    showThemeLabel();
  });
};

export { formatPrice, errorBox, renderLaptopCard, showSkeletons, updateFavoriteButtons, attachFavoriteButtons, setupHeader };
