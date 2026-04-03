#!/usr/bin/env node
const fs = require("fs");
const path = require("path");

// Read .env file manually
const envPath = path.join(__dirname, "..", ".env");
const envContent = fs.readFileSync(envPath, "utf8");

console.log("=== .env File Content ===");
console.log(envContent);
console.log("\n=== Parsed Environment ===");

// Parse manually
const lines = envContent.split("\n");
lines.forEach((line) => {
  if (line.trim() && !line.startsWith("#")) {
    const [key, value] = line.split("=");
    console.log(`${key}=${value}`);
  }
});

console.log("\n=== process.env Values ===");
console.log("DATABASE_URL:", process.env.DATABASE_URL);
console.log("NODE_ENV:", process.env.NODE_ENV);

// Load with dotenv
const dotenv = require("dotenv");
dotenv.config({ path: envPath });

console.log("\n=== After dotenv.config() ===");
console.log("DATABASE_URL:", process.env.DATABASE_URL);
console.log("NODE_ENV:", process.env.NODE_ENV);

console.log("\n=== File System Check ===");
console.log("File exists:", fs.existsSync(envPath));
console.log("File size:", fs.statSync(envPath).size, "bytes");
