import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";

const API_BASE = "http://localhost:5001";

function CollectionView() {
  const { id } = useParams(); // grabs the :id from the URL
  const [collection, setCollection] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  const loadCollection = () => {
    fetch(`${API_BASE}/api/collections/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Not found");
        return res.json();
      })
      .then((data) => {
        setCollection(data);
        setLoading(false);
      })
      .catch(() => {
        setNotFound(true);
        setLoading(false);
      });
  };

  useEffect(() => {
    loadCollection();
  }, [id]);

  // Remove a single image from this collection
  const handleRemove = async (itemId) => {
    try {
      await fetch(`${API_BASE}/api/collections/${id}/items/${itemId}`, {
        method: "DELETE",
      });
      loadCollection(); // refresh to reflect the removal
    } catch (err) {
      console.error("Failed to remove item:", err);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (notFound) return <p>Collection not found. <Link to="/collections">Go back</Link></p>;

  return (
    <div>
      <Link to="/collections">&larr; Back to Collections</Link>
      <h1>{collection.name}</h1>

      {collection.items.length === 0 && (
        <p>
          No images saved yet. Go <Link to="/">search for some</Link>.
        </p>
      )}

      <div className="image-grid">
        {collection.items.map((item) => (
          <div className="image-card" key={item.id}>
            <img src={item.imageUrl} alt={item.tags} />
            <button onClick={() => handleRemove(item.id)} className="delete-btn">
              Remove
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CollectionView;