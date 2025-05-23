
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require("path");

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "frontend")));

mongoose.connect('mongodb://localhost:27017/monthpaydb', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Employee Schema
const EmployeeSchema = new mongoose.Schema({
  name: String,
  position: { type: String, default: "N/A" },
  department: { type: String, default: "N/A" },
  Monthlysalary: { type: Number, default: 0 },
  Timein: { type: String, default: "N/A" },
  Timeout: { type: String, default: "N/A" },
});
const Employee = mongoose.model('Employee', EmployeeSchema);

// History Schema
const HistorySchema = new mongoose.Schema({
  employeeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee' },
  pay: Number,
  createdAt: { type: Date, default: Date.now },
});
const History = mongoose.model('History', HistorySchema);

// Payroll Schema
const PayrollSchema = new mongoose.Schema({
  employeeName: String,
  RateperHour: Number,
  HoursperDay: Number,
  NumbersofDaysWorked: Number,
  GrossSalary: Number,
  Tax: Number,
  Philhealth: Number,
  SSS: Number,
  TotalDeductions: Number,
  NetSalary: Number,
  createdAt: { type: Date, default: Date.now }
});
const Payroll = mongoose.model('Payroll', PayrollSchema);

// API ROUTES
app.get('/api/employees', async (req, res) => {
  try {
    const employees = await Employee.find();
    res.json(employees);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/employees/:id', async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);
    if (!employee) return res.status(404).json({ error: "Employee not found" });
    res.json(employee);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/employees', async (req, res) => {
  try {
    const {
      name,
      position,
      department,
      Monthlysalary,
      Timein,
      Timeout
    } = req.body;

    if (!name || typeof Monthlysalary !== 'number') {
      return res.status(400).json({ error: 'Name and Monthlysalary are required' });
    }

    const employee = new Employee({
      name,
      position,
      department,
      Monthlysalary,
      Timein,
      Timeout
    });

    const saved = await employee.save();
    res.status(201).json(saved);
  } catch (err) {
    console.error("Add employee error:", err);
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/employees/:id', async (req, res) => {
  try {
    const updated = await Employee.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/employees/:id', async (req, res) => {
  try {
    await Employee.findByIdAndDelete(req.params.id);
    res.json({ message: "Employee deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/history/:employeeId', async (req, res) => {
  try {
    const { employeeId } = req.params;
    const history = await History.find({ employeeId }).sort({ createdAt: -1 });
    res.json(history);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/calculate', async (req, res) => {
  try {
    const { employeeId } = req.body;
    if (!employeeId) return res.status(400).json({ error: 'Employee ID required' });

    const employee = await Employee.findById(employeeId);
    if (!employee) return res.status(404).json({ error: 'Employee not found' });

    const pay = +(employee.Monthlysalary / 12).toFixed(2);

    const newHistory = new History({ employeeId, pay });
    await newHistory.save();

    res.json({ pay });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/payrolls', async (req, res) => {
  try {
    const payrolls = await Payroll.find().sort({ createdAt: -1 });
    res.json(payrolls);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/payrolls', async (req, res) => {
  try {
    const payroll = new Payroll(req.body);
    const savedPayroll = await payroll.save();
    res.status(201).json(savedPayroll);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/payrolls/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updatedPayroll = await Payroll.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });

    if (!updatedPayroll) return res.status(404).json({ error: 'Payroll record not found' });

    res.json(updatedPayroll);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/payrolls/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Payroll.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ error: 'Payroll record not found' });

    res.json({ message: 'Payroll record deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.use('/api', (req, res) => {
  res.status(404).json({ error: "API route not found" });
});

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "frontend", "index.html"));
});

const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));

