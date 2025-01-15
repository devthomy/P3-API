const express = require("express");
const router = express.Router();
const pool = require("../db");

router.get("/", async (req, res) => {
  try {
    console.log("Fetching all domains...");
    const result = await pool.query("SELECT * FROM Domains");
    console.log(`Found ${result.rows.length} domains`);
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching domains:", err.message);
    res.status(500).json({ error: err.message });
  }
});

router.post("/", async (req, res) => {
  const { userId, name } = req.body;
  try {
    console.log("Creating new domain:", { userId, name });
    const result = await pool.query(
      "INSERT INTO Domains (UserId, Name) VALUES ($1, $2) RETURNING *",
      [userId, name]
    );
    console.log("Domain created successfully with ID:", result.rows[0].id);
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("Error creating domain:", err.message);
    res.status(500).json({ error: err.message });
  }
});

router.patch("/:id", async (req, res) => {
  const { id } = req.params;
  const { userId, name } = req.body;
  try {
    console.log("Updating domain with ID:", id);
    const result = await pool.query(
      "UPDATE Domains SET UserId = $1, Name = $2 WHERE Id = $3 RETURNING *",
      [userId, name, id]
    );
    console.log("Domain updated successfully");
    res.json(result.rows[0]);
  } catch (err) {
    console.error("Error updating domain:", err.message);
    res.status(500).json({ error: err.message });
  }
});

router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    console.log("Deleting domain with ID:", id);
    await pool.query("DELETE FROM Domains WHERE Id = $1", [id]);
    console.log("Domain deleted successfully");
    res.status(204).send();
  } catch (err) {
    console.error("Error deleting domain:", err.message);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
