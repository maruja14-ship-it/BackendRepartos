const express = require("express");
const mysql = require("mysql2/promise");
const bodyParser = require("body-parser");
const cors = require("cors");
const bcrypt = require("bcrypt");

const app = express();
app.use(bodyParser.json());
app.use(cors());

const dbConfig = {
    host: "mobility.aldaba.net",      // ej. "mi-servidor.mysql.database.azure.com"
    port: 3306,                   // <- puerto
    user: "Susana",
    password: "$2a$06$ejHHUX6P.4zcjI8Im8GpQOugmIejrF9jQDUrmFvgi6p7apMgX7ipi",
    database: "mobilityrent"
};

// Endpoint de login
app.post("/login", async (req, res) => {
    const { nombre, clave } = req.body;

    try {
        const conn = await mysql.createConnection(dbConfig);
        const [rows] = await conn.execute(
            "SELECT * FROM usuarios WHERE NOMBRE=?",
            [nombre]
        );
        await conn.end();

        if(rows.length > 0){
            const user = rows[0];
            const match = await bcrypt.compare(clave, user.PASSWORD);
            if(match){
                res.json({ success: true, repartidor: { id: user.ID, nombre: user.NOMBRE } });
            } else {
                res.status(401).json({ success: false, message: "Usuario o contraseña incorrecta" });
            }
        } else {
            res.status(401).json({ success: false, message: "Usuario o contraseña incorrecta" });
        }

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Error del servidor" });
    }
});

app.listen(3000, () => console.log("Servidor escuchando en puerto 3000"));
