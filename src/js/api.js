const loadLaptops = async () => {
  const response = await fetch('data/laptops.json');
  if (!response.ok) {
    throw new Error('The laptop file could not be loaded');
  }
  const laptops = await response.json();
  return laptops;
};

const getLaptopById = (laptops, id) => {
  return laptops.find((laptop) => laptop.id === id);
};

export { loadLaptops, getLaptopById };
