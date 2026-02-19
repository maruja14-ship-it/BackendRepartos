const express = require("express");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

// Ruta de prueba
app.get("/ping", (req, res) => {
  res.send("pong");
});

// Render decide el puerto (en local será 3000)
const port = process.env.PORT || 3000;
app.listen(port, "0.0.0.0", () => {
  console.log("Servidor escuchando en puerto " + port);
});
