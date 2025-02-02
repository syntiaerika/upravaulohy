import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import messages from "./translations";
import "./ShoppingListsOverview.css";

const mockShoppingLists = [
  { id: 1, name: "partyShopping" },
  { id: 2, name: "groceries" },
];

const API_URL = "http://localhost:5001/shopping-lists";

const ShoppingListsOverview = ({ userRole, locale, useMockData }) => {
  const [shoppingLists, setShoppingLists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (useMockData) {
      setShoppingLists(mockShoppingLists);
      setLoading(false);
    } else {
      fetch(API_URL)
        .then((res) => res.json())
        .then((data) => {
          setShoppingLists(data);
          setLoading(false);
        })
        .catch(() => {
          setError(messages[locale]["error"]);
          setLoading(false);
        });
    }
  }, [locale, useMockData]);

  return (
    <div className="shopping-lists-overview">
      <h2>{messages[locale]["shoppingListTitle"]}</h2>
      {loading && <p>{messages[locale]["loading"]}</p>}
      {error && <p className="error">{error}</p>}
      <ul>
        {shoppingLists.map((list) => (
          <li key={list.id} className="shopping-list-item">
            <Link to={`/shopping-list/${list.id}`}>{messages[locale][list.name]}</Link>
          </li>
        ))}
      </ul>
      {userRole === "owner" && <button className="tile-button">{messages[locale]["createList"]}</button>}
    </div>
  );
};

export default ShoppingListsOverview;
