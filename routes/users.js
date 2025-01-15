const express = require("express");
const router = express.Router();
const pool = require("../db");

router.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM Users");
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/", async (req, res) => {
  const { lastName, firstName, email, password, role } = req.body;
  try {
    const result = await pool.query(
      "INSERT INTO Users (LastName, FirstName, Email, Password, Role) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [lastName, firstName, email, password, role]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.patch("/:id", async (req, res) => {
  const { id } = req.params;
  const { lastName, firstName, email, password, role } = req.body;
  try {
    const result = await pool.query(
      "UPDATE Users SET LastName = $1, FirstName = $2, Email = $3, Password = $4, Role = $5 WHERE Id = $6 RETURNING *",
      [lastName, firstName, email, password, role, id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query("DELETE FROM Users WHERE Id = $1", [id]);
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
