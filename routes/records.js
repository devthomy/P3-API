// routes/records.js
const express = require("express");
const router = express.Router();
const pool = require("../db");

router.get("/", async (req, res) => {
  try {
    console.log("Fetching all records...");
    const result = await pool.query("SELECT * FROM Records");
    console.log(`Found ${result.rows.length} records`);
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching records:", err.message);
    res.status(500).json({ error: err.message });
  }
});

router.post("/", async (req, res) => {
  const { domainId, recordName, target, priority, ttl, recordType } = req.body;
  try {
    console.log("Creating new record:", {
      domainId,
      recordName,
      target,
      priority,
      ttl,
      recordType,
    });
    const result = await pool.query(
      "INSERT INTO Records (DomainId, RecordName, Target, Priority, TTL, RecordType) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
      [domainId, recordName, target, priority, ttl, recordType]
    );
    console.log("Record created successfully with ID:", result.rows[0].id);
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("Error creating record:", err.message);
    res.status(500).json({ error: err.message });
  }
});

router.patch("/:id", async (req, res) => {
  const { id } = req.params;
  const { domainId, recordName, target, priority, ttl, recordType } = req.body;
  try {
    console.log("Updating record with ID:", id);
    const result = await pool.query(
      "UPDATE Records SET DomainId = $1, RecordName = $2, Target = $3, Priority = $4, TTL = $5, RecordType = $6 WHERE Id = $7 RETURNING *",
      [domainId, recordName, target, priority, ttl, recordType, id]
    );
    console.log("Record updated successfully");
    res.json(result.rows[0]);
  } catch (err) {
    console.error("Error updating record:", err.message);
    res.status(500).json({ error: err.message });
  }
});

router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    console.log("Deleting record with ID:", id);
    await pool.query("DELETE FROM Records WHERE Id = $1", [id]);
    console.log("Record deleted successfully");
    res.status(204).send();
  } catch (err) {
    console.error("Error deleting record:", err.message);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
