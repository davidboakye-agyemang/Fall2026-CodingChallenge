import { useState, useEffect } from "react";

const API_BASE = "http://localhost:5001";

function Search() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [collections, setCollections] = useState([]);
  const [savedMessage, setSavedMessage] = useState("");

  // Load the user's collections once, so we can offer them as "save to" targets
  useEffect(() => {
    fetch(`${API_BASE}/api/collections`)
      .then((res) => res.json())
      .then((data) => setCollections(data))
      .catch((err) => console.error("Failed to load collections:", err));
  }, []);

  // Search Pixabay via our backend proxy
  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/search?q=${encodeURIComponent(query)}`);
      const data = await res.json();
      setResults(data);
    } catch (err) {
      console.error("Search failed:", err);
    } finally {
      setLoading(false);
    }
  };

  // Save a specific image into a specific collection
  const handleSave = async (imageUrl, collectionId) => {
    if (!collectionId) return;

    try {
      await fetch(`${API_BASE}/api/collections/${collectionId}/items`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageUrl, tags: query }),
      });
      setSavedMessage("Saved!");
      setTimeout(() => setSavedMessage(""), 1500);
    } catch (err) {
      console.error("Save failed:", err);
    }
  };

  return (
    <div>
      <h1>Search Images</h1>

      <form onSubmit={handleSearch} className="search-form">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for images..."
        />
        <button type="submit">Search</button>
      </form>

      {savedMessage && <p className="saved-toast">{savedMessage}</p>}

      {loading && <p>Loading...</p>}

      {collections.length === 0 && !loading && (
        <p>
          You don't have any collections yet. Go to{" "}
          <a href="/collections">My Collections</a> to create one before saving images.
        </p>
      )}

      <div className="image-grid">
        {results.map((img) => (
          <div className="image-card" key={img.id}>
            <img src={img.webformatURL} alt={img.tags} />
            {collections.length > 0 && (
              <select
                defaultValue=""
                onChange={(e) => handleSave(img.webformatURL, e.target.value)}
              >
                <option value="" disabled>
                  Save to...
                </option>
                {collections.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Search;