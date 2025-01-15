const express = require("express");
const router = express.Router();
const pool = require("../db");

router.get("/", async (req, res) => {
  try {
    console.log("Fetching all users...");
    const result = await pool.query("SELECT * FROM Users");
    console.log(`Found ${result.rows.length} users`);
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching users:", err.message);
    res.status(500).json({ error: err.message });
  }
});

router.post("/", async (req, res) => {
  const { lastName, firstName, email, password, role } = req.body;
  try {
    console.log("Creating new user:", { lastName, firstName, email, role });
    const result = await pool.query(
      "INSERT INTO Users (LastName, FirstName, Email, Password, Role) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [lastName, firstName, email, password, role]
    );
    console.log("User created successfully with ID:", result.rows[0].id);
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("Error creating user:", err.message);
    res.status(500).json({ error: err.message });
  }
});

router.patch("/:id", async (req, res) => {
  const { id } = req.params;
  const { lastName, firstName, email, password, role } = req.body;
  try {
    console.log("Updating user with ID:", id);
    const result = await pool.query(
      "UPDATE Users SET LastName = $1, FirstName = $2, Email = $3, Password = $4, Role = $5 WHERE Id = $6 RETURNING *",
      [lastName, firstName, email, password, role, id]
    );
    console.log("User updated successfully");
    res.json(result.rows[0]);
  } catch (err) {
    console.error("Error updating user:", err.message);
    res.status(500).json({ error: err.message });
  }
});

router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    console.log("Deleting user with ID:", id);
    await pool.query("DELETE FROM Users WHERE Id = $1", [id]);
    console.log("User deleted successfully");
    res.status(204).send();
  } catch (err) {
    console.error("Error deleting user:", err.message);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
