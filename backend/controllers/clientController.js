import db from "../config/db.js";

export const getClients = (req, res) => {
  db.query("SELECT * FROM clients", (err, results) => {
    if (err) return res.status(500).send(err);
    res.json(results);
  });
};

export const addClient = (req, res) => {
  const { name, email, phone } = req.body;
  db.query(
    "INSERT INTO clients (name, email, phone) VALUES (?, ?, ?)",
    [name, email, phone],
    (err, results) => {
      if (err) return res.status(500).send(err);
      res.json({ message: "Client added!", id: results.insertId });
    }
  );
};
