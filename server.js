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

const startServer = async () => {
  const { default: chalk } = await import("chalk");

  app.listen(port, () => {
    console.log("\n");
    console.log(chalk.cyan("🚀 Starting server..."));
    console.log(chalk.green("✅ Server successfully started!"));
    console.log(chalk.yellow(`🌐 Server running on port ${port}`));
    console.log(chalk.magenta("📡 API endpoints ready:"));
    console.log(chalk.blue("   - /users"));
    console.log(chalk.blue("   - /domains"));
    console.log(chalk.blue("   - /records"));
    console.log(chalk.blue("   - /dns"));
    console.log("\n");
  });
};

startServer();
