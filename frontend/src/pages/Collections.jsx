import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const API_BASE = "http://localhost:5001";

function Collections() {
  const [collections, setCollections] = useState([]);
  const [newName, setNewName] = useState("");
  const [loading, setLoading] = useState(true);

  // Load all collections when the page mounts
  const loadCollections = () => {
    fetch(`${API_BASE}/api/collections`)
      .then((res) => res.json())
      .then((data) => {
        setCollections(data);
        setLoading(false);
      })
      .catch((err) => console.error("Failed to load collections:", err));
  };

  useEffect(() => {
    loadCollections();
  }, []);

  // Create a new collection
  const handleCreate = async (e) => {
    e.preventDefault();
    if (!newName.trim()) return;

    try {
      await fetch(`${API_BASE}/api/collections`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newName }),
      });
      setNewName("");
      loadCollections(); // refresh the list to show the new one
    } catch (err) {
      console.error("Failed to create collection:", err);
    }
  };

  // Delete a whole collection
  const handleDelete = async (id) => {
    const confirmed = window.confirm("Delete this collection and everything in it?");
    if (!confirmed) return;

    try {
      await fetch(`${API_BASE}/api/collections/${id}`, { method: "DELETE" });
      loadCollections(); // refresh the list
    } catch (err) {
      console.error("Failed to delete collection:", err);
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <h1>My Collections</h1>

      <form onSubmit={handleCreate} className="new-collection-form">
        <input
          type="text"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          placeholder="New collection name..."
        />
        <button type="submit">Create</button>
      </form>

      {collections.length === 0 && <p>No collections yet. Create one above!</p>}

      <div className="collections-list">
        {collections.map((c) => (
          <div className="collection-card" key={c.id}>
            <Link to={`/collections/${c.id}`}>
              <h3>{c.name}</h3>
              <p>{c.items.length} image{c.items.length !== 1 ? "s" : ""}</p>
            </Link>
            <button onClick={() => handleDelete(c.id)} className="delete-btn">
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Collections;