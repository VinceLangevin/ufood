export const getFilterPriceName = (price) => {
  switch (price) {
    case 1:
      return "Cheap";
    case 2:
      return "Moderate";
    case 3:
      return "Expensive";
  }
};

export const clearFilters = () => {
  for (const price in selectedPrices) {
    selectedPrices[price] = false;
  }
  for (const type in selectedTypes) {
    selectedTypes[type] = false;
  }
  for (const rating in selectedRatings) {
    selectedRatings[rating] = false;
  }
};

export const validateTextInput = (listName) => {
  const minLength = 1;
  const maxLength = 50;

  if (!listName.trim()) {
    throw new Error("List name cannot be empty.");
  }

  if (listName.length < minLength) {
    throw new Error(`List name must be at least ${minLength} characters long.`);
  }

  if (listName.length > maxLength) {
    throw new Error(`List name must not exceed ${maxLength} characters.`);
  }

  if (!/^[a-zA-Z0-9 _-]+$/.test(listName)) {
    throw new Error("List name contains invalid characters.");
  }

  return true;
};
