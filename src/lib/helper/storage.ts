// src/lib/helper/storage.ts
export const setLocalStorageWithExpiration = (key, value, durationInHours) => {
  if (typeof window === 'undefined') {
    return;
  }
  const now = new Date();
  const item = {
    value: value,
    expiry: now.getTime() + durationInHours * 60 * 60 * 1000,
  };
  localStorage.setItem(key, JSON.stringify(item));
};

export const getLocalStorageWithExpiration = (key) => {
  if (typeof window === 'undefined') {
    return null;
  }
  const itemStr = localStorage.getItem(key);
  console.log('itemStr:::::::::::::::::::::::::::::::::::::::::::::', itemStr);

  if (!itemStr) {
    return null;
  }

  try {
    const item = JSON.parse(itemStr);
    const now = new Date();

    if (now.getTime() > item.expiry) {
      localStorage.removeItem(key);
      return null;
    }

    return item.value;
  } catch (error) {
    // This catches the SyntaxError for invalid JSON
    console.error(`Error parsing localStorage item for key "${key}":`, error);
    localStorage.removeItem(key); // Clear the bad data
    return null;
  }
};

export const removeLocalStorageItem = (key) => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(key);
  }
};
