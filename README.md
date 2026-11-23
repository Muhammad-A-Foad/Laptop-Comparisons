# Student Laptop Finder

A responsive web app that helps students browse laptops, search and filter them,
read full specifications, save favorites, and compare them side by side.
Built for SW302 Assignment 2 with JavaScript ES modules and Tailwind CSS 4.

## Pages

- `index.html` — home page with live statistics and links to the other pages
- `laptops.html` — catalogue with live search, filters, sorting, and loading skeletons
- `details.html` — full specifications for one laptop (`details.html?id=7`)
- `favorites.html` — saved favorites with total and average price
- `compare.html` — side-by-side comparison of two to four favorites

## How to run

The pages load `data/laptops.json` with `fetch()`, so they must be opened from a
local server and not by double-clicking the HTML files.

1. Install the packages (only needed once, or to rebuild the CSS):

```
npm install
```

2. Build the Tailwind stylesheet:

```
npm run build
```

3. To keep rebuilding while you edit classes:

```
npm run watch
```

4. Open the site with a local server such as VS Code Live Server, or run:

```
npx serve .
```

Then open the address it prints in Chrome or Edge.

## Project structure

```
laptop_finder_muhammad_ahmad/
├─ index.html  laptops.html  details.html  favorites.html  compare.html
├─ src/
│  ├─ input.css
│  └─ js/          api.js  storage.js  ui.js  compare.js  + one file per page
├─ data/laptops.json
├─ dist/output.css
├─ assets/         laptop images
├─ package.json
└─ README.md
```

## Notes

- `node_modules/` is not part of the submission, `package.json` is enough to reinstall.
- Favorites and the chosen theme (Performance Mode / Battery Saver Mode) are stored in
  `localStorage`, so they survive a page reload.
- GitHub repo: add your repository link here before submitting.
