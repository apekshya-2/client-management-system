import mysql from "mysql2";

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "clientms"
});

db.connect(err => {
  if (err) console.log(err);
  else console.log("DB Connected!");
});

export default db;
