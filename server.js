const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const path = require("path");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());


mongoose.connect("mongodb://127.0.0.1:27017/payrollDB");

const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));
db.once("open", () => console.log("✅ Connected to MongoDB"));

// Payroll schema & model
const PayrollSchema = new mongoose.Schema({
  ratePerHour: Number,
  hoursPerDay: Number,
  daysWorked: Number,
  grossSalary: Number,
  tax: Number,
  philHealth: Number,
  sss: Number,
  totalDeduction: Number,
  netSalary: Number,
  createdAt: { type: Date, default: Date.now },
});

const Payroll = mongoose.model("Payroll", PayrollSchema);

// Serve frontend static files from the "frontend" folder
app.use(express.static(path.join(__dirname, "frontend")));

// CRUD routes for Payroll

// Create
app.post("/payroll", async (req, res) => {
  try {
    const payroll = new Payroll(req.body);
    const saved = await payroll.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Read all
app.get("/payroll", async (req, res) => {
  const payrolls = await Payroll.find().sort({ createdAt: -1 });
  res.json(payrolls);
});

// Read one
app.get("/payroll/:id", async (req, res) => {
  try {
    const payroll = await Payroll.findById(req.params.id);
    if (!payroll) return res.status(404).json({ error: "Not found" });
    res.json(payroll);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


app.put("/payroll/:id", async (req, res) => {
  try {
    const updated = await Payroll.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


app.delete("/payroll/:id", async (req, res) => {
  try {
    await Payroll.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "frontend", "index.html"));
});

// Start server
app.listen(PORT, () => console.log(`🚀 Server running at http://localhost:${PORT}`));
