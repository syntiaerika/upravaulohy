const mockData = [
  { id: 1, name: "Groceries", archived: false },
  { id: 2, name: "Electronics", archived: false },
];

export async function fetchShoppingLists(useMockData) {
  try {
    if (useMockData) {
      return new Promise((resolve) => setTimeout(() => resolve(mockData), 500));
    } else {
      const response = await fetch("https://your-api.com/shopping-lists");
      if (!response.ok) throw new Error("Failed to load shopping lists");
      return response.json();
    }
  } catch (error) {
    console.error("Error fetching lists:", error);
    throw error;
  }
}

export async function addShoppingList(name, useMockData) {
  try {
    if (useMockData) {
      return new Promise((resolve) => {
        const newList = { id: Date.now(), name, archived: false };
        mockData.push(newList);
        setTimeout(() => resolve(newList), 500);
      });
    } else {
      const response = await fetch("https://your-api.com/shopping-lists", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });
      if (!response.ok) throw new Error("Failed to add shopping list");
      return response.json();
    }
  } catch (error) {
    console.error("Error adding list:", error);
    throw error;
  }
}
