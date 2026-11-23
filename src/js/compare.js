const COMPARE_KEY = 'laptop-compare';

const getCompareIds = () => {
  const saved = localStorage.getItem(COMPARE_KEY);
  if (!saved) {
    return [];
  }
  try {
    return JSON.parse(saved);
  } catch (error) {
    return [];
  }
};

const saveCompareIds = (ids) => {
  localStorage.setItem(COMPARE_KEY, JSON.stringify(ids));
};

const addToCompare = (id) => {
  const ids = getCompareIds();
  if (ids.includes(id)) {
    return { ok: true, message: 'This laptop is already in the comparison.' };
  }
  if (ids.length >= 4) {
    return { ok: false, message: 'You can compare up to 4 laptops. Remove one before adding another.' };
  }
  ids.push(id);
  saveCompareIds(ids);
  return { ok: true, message: 'Added to the comparison.' };
};

const removeFromCompare = (id) => {
  const ids = getCompareIds();
  const remaining = ids.filter((item) => item !== id);
  saveCompareIds(remaining);
};

const findBestLaptop = (laptops, getValue, direction) => {
  return laptops.reduce((best, laptop) => {
    if (direction === 'low') {
      if (getValue(laptop) < getValue(best)) {
        return laptop;
      }
      return best;
    }
    if (getValue(laptop) > getValue(best)) {
      return laptop;
    }
    return best;
  }, laptops[0]);
};

export { getCompareIds, saveCompareIds, addToCompare, removeFromCompare, findBestLaptop };
