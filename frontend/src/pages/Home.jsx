import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const API_BASE = "http://localhost:5001";

function Home() {
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_BASE}/api/collections`)
      .then((res) => res.json())
      .then((data) => {
        setCollections(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const totalItems = collections.reduce((sum, c) => sum + c.items.length, 0);
  const recentCollections = [...collections]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 3);

  return (
    <div>
      <section className="hero">
        <h1>
          Never lose what you love. <span className="wave">🐟</span>
        </h1>
        <p className="hero-subtitle">
          Goldfish is where you save the things you find online before you
          forget where you saw them. Search, save, organize, and come back
          to it later.
        </p>
        <div className="hero-actions">
          <Link to="/search">
            <button>Start Searching</button>
          </Link>
          <Link to="/collections" className="secondary-link">
            View My Collections &rarr;
          </Link>
        </div>
      </section>

      <section className="stats-row">
        <div className="stat-card">
          <div className="stat-number">{collections.length}</div>
          <div className="stat-label">Collections</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{totalItems}</div>
          <div className="stat-label">Images Saved</div>
        </div>
      </section>

      <section>
        <h2>Recent Collections</h2>
        {loading && <p>Loading...</p>}
        {!loading && collections.length === 0 && (
          <p>
            You haven't created any collections yet.{" "}
            <Link to="/collections">Create your first one</Link>.
          </p>
        )}
        <div className="collections-list">
          {recentCollections.map((c) => (
            <Link to={`/collections/${c.id}`} className="collection-card" key={c.id}>
              <h3>{c.name}</h3>
              <p>{c.items.length} image{c.items.length !== 1 ? "s" : ""}</p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}

export default Home;