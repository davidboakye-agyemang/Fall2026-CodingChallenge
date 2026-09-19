import { Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home.jsx";
import Search from "./pages/Search.jsx";
import Collections from "./pages/Collections.jsx";
import CollectionView from "./pages/CollectionView.jsx";
import "./App.css";

function App() {
  return (
    <div>
      <nav className="navbar">
        <Link to="/" className="logo">Goldfish <span>🐟</span></Link>
        <div className="nav-links">
          <Link to="/">Home</Link>
          <Link to="/search">Search</Link>
          <Link to="/collections">My Collections</Link>
        </div>
      </nav>

      <div className="page-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/search" element={<Search />} />
          <Route path="/collections" element={<Collections />} />
          <Route path="/collections/:id" element={<CollectionView />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;