// routes/records.js
const express = require("express");
const router = express.Router();
const pool = require("../db");

router.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM Records");
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/", async (req, res) => {
  const { domainId, recordName, target, priority, ttl, recordType } = req.body;
  try {
    const result = await pool.query(
      "INSERT INTO Records (DomainId, RecordName, Target, Priority, TTL, RecordType) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
      [domainId, recordName, target, priority, ttl, recordType]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.patch("/:id", async (req, res) => {
  const { id } = req.params;
  const { domainId, recordName, target, priority, ttl, recordType } = req.body;
  try {
    const result = await pool.query(
      "UPDATE Records SET DomainId = $1, RecordName = $2, Target = $3, Priority = $4, TTL = $5, RecordType = $6 WHERE Id = $7 RETURNING *",
      [domainId, recordName, target, priority, ttl, recordType, id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query("DELETE FROM Records WHERE Id = $1", [id]);
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
