// server.js
const express = require("express");
const cors = require("cors");
const path = require("path");
const multer = require("multer");
const bcrypt = require("bcryptjs");
const db = require("./db"); // <-- your existing db.js

const app = express();
app.use(cors());
app.use(express.json());

// ------------------------------------------------------
// STATIC FILES (serve uploaded receipts)
// ------------------------------------------------------
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ------------------------------------------------------
// MULTER CONFIG (receipt uploads)
// ------------------------------------------------------
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, unique + ext);
  }
});

const upload = multer({ storage });

// ------------------------------------------------------
// LOGIN ROUTE (unchanged)
// ------------------------------------------------------
app.post("/api/login", (req, res) => {
  const { committee_id, password } = req.body;

  const sql = `SELECT * FROM committee_users WHERE name = ?`;

  db.get(sql, [committee_id], async (err, user) => {
    if (err) return res.status(500).json({ error: "Database error" });
    if (!user) return res.status(401).json({ error: "Invalid ID or password" });

    try {
      const match = await bcrypt.compare(password, user.password);
      if (!match) return res.status(401).json({ error: "Invalid ID or password" });

      return res.json({
        message: "Login successful",
        id: user.id,
        name: user.name,
        role: user.role
      });
    } catch (compareErr) {
      return res.status(500).json({ error: "Authentication error" });
    }
  });
});

// ------------------------------------------------------
// FINANCIAL ROUTES
// ------------------------------------------------------

// GET ALL TRANSACTIONS
app.get("/api/financials", (req, res) => {
  const sql = `SELECT * FROM financial_transactions ORDER BY date DESC`;

  db.all(sql, [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });

    // Convert receipt_path → full URL
    const mapped = rows.map((r) => ({
      ...r,
      receipt_url: r.receipt_path
        ? `${req.protocol}://${req.get("host")}/uploads/${r.receipt_path}`
        : null
    }));

    res.json(mapped);
  });
});

// ADD TRANSACTION (with optional receipt)
app.post("/api/financials", upload.single("receipt"), (req, res) => {
  const { date, category, fund, amount, description } = req.body;

  const receiptPath = req.file ? req.file.filename : null;

  const sql = `
    INSERT INTO financial_transactions
    (date, category, fund, amount, description, receipt_path)
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  db.run(
    sql,
    [date, category, fund, amount, description, receiptPath],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });

      res.json({ id: this.lastID });
    }
  );
});

// UPDATE TRANSACTION
app.put("/api/financials/:id", upload.single("receipt"), (req, res) => {
  const { id } = req.params;
  const { date, category, fund, amount, description } = req.body;

  const receiptPath = req.file ? req.file.filename : null;

  const sql = `
    UPDATE financial_transactions
    SET date = ?, category = ?, fund = ?, amount = ?, description = ?,
        receipt_path = COALESCE(?, receipt_path)
    WHERE id = ?
  `;

  db.run(
    sql,
    [date, category, fund, amount, description, receiptPath, id],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });

      res.json({ updated: this.changes });
    }
  );
});

// DELETE TRANSACTION
app.delete("/api/financials/:id", (req, res) => {
  const { id } = req.params;

  const sql = `DELETE FROM financial_transactions WHERE id = ?`;

  db.run(sql, [id], function (err) {
    if (err) return res.status(500).json({ error: err.message });

    res.json({ deleted: this.changes });
  });
});

// ------------------------------------------------------
// START SERVER
// ------------------------------------------------------
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
