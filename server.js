const express = require("express");
const mysql = require("mysql2/promise");
const cors = require("cors");
const bcrypt = require("bcrypt");

const app = express();
app.use(express.json());
app.use(cors());

app.get("/ping", (req, res) => res.send("pong"));

const dbConfig = {
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT || 3306),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
};

// login
app.post("/login", async (req, res) => {
  const { nombre, clave } = req.body || {};
  if (!nombre || !clave) {
    return res.status(400).json({ success: false, message: "Faltan datos" });
  }

  try {
    const conn = await mysql.createConnection(dbConfig);

    const [rows] = await conn.execute(
      "SELECT ID, NOMBRE, PASSWORD FROM usuarios WHERE NOMBRE = ? LIMIT 1",
      [nombre]
    );

    await conn.end();

    if (rows.length === 0) {
      return res.status(401).json({ success: false, message: "Usuario o contraseña incorrecta" });
    }

    const user = rows[0];

    // user.PASSWORD debe ser el hash bcrypt guardado en la BD
    const match = await bcrypt.compare(clave, user.PASSWORD);
    if (!match) {
      return res.status(401).json({ success: false, message: "Usuario o contraseña incorrecta" });
    }

    return res.json({ success: true, repartidor: { id: user.ID, nombre: user.NOMBRE } });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: "Error del servidor" });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, "0.0.0.0", () => console.log("Servidor escuchando en puerto " + port));
