// server.js — REST API for the Image Saving/Sharing App

import express from "express";
import cors from "cors";
import { JSONFilePreset } from "lowdb/node";
import { randomUUID } from "crypto";

// --- Database setup ---
// lowdb stores everything in a JSON file (db.json) — no server or account needed.
// defaultData is what gets written the first time the file doesn't exist yet.
const defaultData = { collections: [] };
const db = await JSONFilePreset("db.json", defaultData);

// --- App setup ---
const app = express();
app.use(cors());           // allow the React frontend (different port) to call this API
app.use(express.json());   // parse incoming JSON request bodies

const PORT = 5001;

// --- Routes ---

// Health check — just to confirm the server is alive
app.get("/", (req, res) => {
  res.send("Backend is running!");
});

// GET all collections
app.get("/api/collections", async (req, res) => {
  await db.read();
  res.json(db.data.collections);
});

// GET a single collection by id
app.get("/api/collections/:id", async (req, res) => {
  await db.read();
  const collection = db.data.collections.find(c => c.id === req.params.id);
  if (!collection) return res.status(404).json({ error: "Collection not found" });
  res.json(collection);
});

// POST — create a new collection
app.post("/api/collections", async (req, res) => {
  const { name } = req.body;
  if (!name) return res.status(400).json({ error: "Collection name is required" });

  const newCollection = {
    id: randomUUID(),
    name,
    items: [],
    createdAt: new Date().toISOString(),
  };

  db.data.collections.push(newCollection);
  await db.write();
  res.status(201).json(newCollection);
});

// DELETE a whole collection
app.delete("/api/collections/:id", async (req, res) => {
  await db.read();
  db.data.collections = db.data.collections.filter(c => c.id !== req.params.id);
  await db.write();
  res.status(204).send();
});

// POST — add an image to a collection
app.post("/api/collections/:id/items", async (req, res) => {
  await db.read();
  const collection = db.data.collections.find(c => c.id === req.params.id);
  if (!collection) return res.status(404).json({ error: "Collection not found" });

  const { imageUrl, tags } = req.body;
  if (!imageUrl) return res.status(400).json({ error: "imageUrl is required" });

  const newItem = { id: randomUUID(), imageUrl, tags: tags || "" };
  collection.items.push(newItem);
  await db.write();
  res.status(201).json(newItem);
});

// DELETE — remove an image from a collection
app.delete("/api/collections/:id/items/:itemId", async (req, res) => {
  await db.read();
  const collection = db.data.collections.find(c => c.id === req.params.id);
  if (!collection) return res.status(404).json({ error: "Collection not found" });

  collection.items = collection.items.filter(item => item.id !== req.params.itemId);
  await db.write();
  res.status(204).send();
});

// GET — search Pixabay for images (proxied so our API key stays hidden from the frontend)
const PIXABAY_API_KEY = "57650242-39bda06ff49e32f544379bbc1";

app.get("/api/search", async (req, res) => {
  const { q } = req.query;
  if (!q) return res.status(400).json({ error: "q (query) parameter is required" });

  try {
    const response = await fetch(
      `https://pixabay.com/api/?key=${PIXABAY_API_KEY}&q=${encodeURIComponent(q)}&image_type=photo`
    );
    const data = await response.json();
    res.json(data.hits); // array of image results
  } catch (err) {
    console.error("Pixabay fetch error:", err);
    res.status(500).json({ error: "Failed to fetch from Pixabay" });
  }
});

// --- Start server ---
app.listen(PORT, () => {
  console.log(`Backend running at http://localhost:${PORT}`);
});

