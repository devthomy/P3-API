const express = require("express");
const router = express.Router();
const pool = require("../db");

router.get("/", async (req, res) => {
  try {
    console.log("Fetching all DNS servers...");
    const result = await pool.query("SELECT * FROM DNSServers");
    console.log(`Found ${result.rows.length} DNS servers`);
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching DNS servers:", err.message);
    res.status(500).json({ error: err.message });
  }
});

router.post("/", async (req, res) => {
  const { ipAddress, url } = req.body;
  try {
    console.log("Creating new DNS server:", { ipAddress, url });
    const result = await pool.query(
      "INSERT INTO DNSServers (IPAddress, URL) VALUES ($1, $2) RETURNING *",
      [ipAddress, url]
    );
    console.log("DNS server created successfully with ID:", result.rows[0].id);
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("Error creating DNS server:", err.message);
    res.status(500).json({ error: err.message });
  }
});

router.patch("/:id", async (req, res) => {
  const { id } = req.params;
  const { ipAddress, url } = req.body;
  try {
    console.log("Updating DNS server with ID:", id);
    const result = await pool.query(
      "UPDATE DNSServers SET IPAddress = $1, URL = $2 WHERE Id = $3 RETURNING *",
      [ipAddress, url, id]
    );
    console.log("DNS server updated successfully");
    res.json(result.rows[0]);
  } catch (err) {
    console.error("Error updating DNS server:", err.message);
    res.status(500).json({ error: err.message });
  }
});

router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    console.log("Deleting DNS server with ID:", id);
    await pool.query("DELETE FROM DNSServers WHERE Id = $1", [id]);
    console.log("DNS server deleted successfully");
    res.status(204).send();
  } catch (err) {
    console.error("Error deleting DNS server:", err.message);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
