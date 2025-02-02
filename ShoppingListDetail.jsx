import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import messages from "./translations";
import "./ShoppingListDetail.css";

const API_URL = "http://localhost:5001/shopping-lists";

const ShoppingListDetail = ({ userRole, locale, useMockData }) => {
  const { id } = useParams();
  const [shoppingList, setShoppingList] = useState(null);
  const [loading, setLoading] = useState(true);
  const [newItem, setNewItem] = useState("");
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchShoppingList();
  }, [id, locale]);

  const fetchShoppingList = () => {
    setLoading(true);
    fetch(`${API_URL}/${id}`)
      .then((res) => res.json())
      .then((data) => {
        console.log("Fetched shopping list:", data); 
        setShoppingList(data);
        setLoading(false);
      })
      .catch(() => {
        setError(messages[locale]["error"]);
        setLoading(false);
      });
  };

  const addItem = () => {
    fetch(`${API_URL}/${id}/items`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newItem, quantity: 1 }),
    })
      .then((res) => res.json())
      .then(() => {
        setNewItem("");
        fetchShoppingList();
      })
      .catch(() => alert(messages[locale]["error"]));
  };

  const deleteItem = (itemId) => {
    const numericItemId = parseInt(itemId, 10);
    if (isNaN(numericItemId)) {
      console.error("❌ Invalid item ID: ", itemId);
      alert("Error: Invalid item ID");
      return;
    }

    const deleteUrl = `${API_URL}/${id}/items/${numericItemId}`;
    console.log(`🗑️ Deleting item with ID: ${numericItemId}, URL: ${deleteUrl}`);

    fetch(deleteUrl, {
      method: "DELETE",
      headers: { "Accept": "application/json" },
    })
      .then((res) => {
        if (!res.ok) {
          return res.json().then((data) => {
            console.error("❌ Delete error:", data);
            throw new Error(messages[locale]["error"]);
          });
        }
        return res.json();
      })
      .then(() => {
        console.log(`✅ Item ${numericItemId} deleted successfully.`);
        fetchShoppingList();
      })
      .catch((err) => {
        console.error("❌ Failed to delete item:", err);
        alert(messages[locale]["error"]);
      });
  };

  if (loading) return <p>{messages[locale]["loading"]}</p>;
  if (error) return <p className="error">{error}</p>;

  return (
    <div className="shopping-list-detail">
      <h2 className="shopping-list-title">{messages[locale][shoppingList.name] || shoppingList.name}</h2>
      <ul>
        {shoppingList.items.map((item) => {
          console.log("🔍 Checking item:", item); 
          if (!item.id) {
            console.warn("⚠️ Warning: Item has no valid ID!", item);
          }

          return (
            <li key={item.id} className="shopping-list-item">
              {messages[locale][`item.${item.name}`] || item.name} ({item.quantity})
              {userRole === "owner" && (
                <button className="delete-button" onClick={() => deleteItem(item.id)}>
                  {messages[locale]["delete"]}
                </button>
              )}
            </li>
          );
        })}
      </ul>
      {userRole !== "viewer" && (
        <div>
          <input
            type="text"
            placeholder={messages[locale]["newItem"]}
            value={newItem}
            onChange={(e) => setNewItem(e.target.value)}
            className="input-field"
          />
          <button onClick={addItem} className="tile-button">{messages[locale]["addItem"]}</button>
        </div>
      )}
    </div>
  );
};

export default ShoppingListDetail;
