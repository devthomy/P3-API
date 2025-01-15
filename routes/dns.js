const express = require("express");
const router = express.Router();
const pool = require("../db");

router.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM DNSServers");
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/", async (req, res) => {
  const { ipAddress, url } = req.body;
  try {
    const result = await pool.query(
      "INSERT INTO DNSServers (IPAddress, URL) VALUES ($1, $2) RETURNING *",
      [ipAddress, url]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.patch("/:id", async (req, res) => {
  const { id } = req.params;
  const { ipAddress, url } = req.body;
  try {
    const result = await pool.query(
      "UPDATE DNSServers SET IPAddress = $1, URL = $2 WHERE Id = $3 RETURNING *",
      [ipAddress, url, id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query("DELETE FROM DNSServers WHERE Id = $1", [id]);
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
