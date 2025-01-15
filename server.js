const express = require("express");
const bodyParser = require("body-parser");
const usersRoutes = require("./routes/users");
const domainsRoutes = require("./routes/domains");
const recordsRoutes = require("./routes/records");
const dnsRoutes = require("./routes/dns");

const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.json());

// Routes
app.use("/users", usersRoutes);
app.use("/domains", domainsRoutes);
app.use("/records", recordsRoutes);
app.use("/dns", dnsRoutes);

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
