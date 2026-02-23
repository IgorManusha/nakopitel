const express = require("express");
const app = express();
app.use(express.json());
const cors = require("cors");
app.use(cors());

const axios = require("axios");

const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("./base.db");

const PORT = process.env.PORT || 3000;

app.post("/api/data", (req, res) => {
  const { istochnik, summa } = req.body;
  db.run(
    "INSERT INTO dohod (istochnik, summa) VALUES (?, ?)",
    [istochnik, summa],
    function (err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json({ id: this.lastID });
    },
  );
});

// Sample route

app.get("/api/kursprivat", (req, res) => {
  const getDataKurs = async () => {
    try {
      const response = await axios.get(
        "https://api.privatbank.ua/p24api/pubinfo?exchange&coursid=5",
      );
      res.json(response.data);
    } catch (error) {
      console.error("Error fetching currency data:", error);
      res.status(500).json({ error: "Failed to fetch currency data" });
    }
  };
  getDataKurs();
});

app.get("/api", (req, res) => {
  db.all("SELECT * FROM dohod", [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    } else {
      res.json(rows);
    }
  });
});

app.delete("/api/del/:id", (req, res) => {
  const { id } = req.params;
  db.run("DELETE FROM dohod WHERE id = ?", [id], function (err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ message: "Record deleted", changes: this.changes });
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
