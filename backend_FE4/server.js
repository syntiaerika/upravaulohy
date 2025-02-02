const express = require("express");
const cors = require("cors");
const app = express();
const PORT = 5001;

app.use(cors());
app.use(express.json());

let shoppingLists = [
  {
    id: "1",
    name: "Weekly Groceries",
    owner: "admin",
    archived: false,
    items: [
      { id: "a", name: "Milk", quantity: 1, completed: false },
      { id: "b", name: "Bread", quantity: 2, completed: false },
    ],
    members: ["user1", "user2"],
  },
];

app.get("/shopping-lists", (req, res) => {
  res.json(shoppingLists);
});

app.get("/shopping-lists/:id", (req, res) => {
  const list = shoppingLists.find((l) => l.id === req.params.id);
  list ? res.json(list) : res.status(404).json({ error: "Shopping list not found" });
});

app.post("/shopping-lists", (req, res) => {
  const { name, owner } = req.body;
  const newList = {
    id: String(shoppingLists.length + 1),
    name,
    owner,
    archived: false,
    items: [],
    members: [],
  };
  shoppingLists.push(newList);
  res.status(201).json(newList);
});

app.post("/shopping-lists/:id/items", (req, res) => {
  const { name, quantity } = req.body;
  const list = shoppingLists.find((l) => l.id === req.params.id);
  if (!list) return res.status(404).json({ error: "Shopping list not found" });

  list.items.push({ id: String(list.items.length + 1), name, quantity, completed: false });
  res.status(201).json(list);
});

app.delete("/shopping-lists/:listId/items/:itemId", (req, res) => {
  const list = shoppingLists.find((l) => l.id === req.params.listId);
  if (!list) return res.status(404).json({ error: "Shopping list not found" });

  list.items = list.items.filter((item) => item.id !== req.params.itemId);
  res.json(list);
});


app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
