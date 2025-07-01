// index.js
import express from "express";
import sqlite3 from "sqlite3";
import { open } from "sqlite";

const app = express();
app.use(express.json());

// abrir base SQLite en archivo local
let db;
(async () => {
  db = await open({
    filename: "./personas.db",
    driver: sqlite3.Database,
  });

  // crear tabla si no existe
  await db.exec(`
    CREATE TABLE IF NOT EXISTS personas (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      tramite TEXT,
      apellido TEXT,
      nombre TEXT,
      genero TEXT,
      dni TEXT,
      ejemplar TEXT,
      fecha_nacimiento TEXT,
      fecha_emision TEXT,
      cuil TEXT
    )
  `);
})();

// POST /personas
app.post("/personas", async (req, res) => {
  const {
    tramite,
    apellido,
    nombre,
    genero,
    dni,
    ejemplar,
    fecha_nacimiento,
    fecha_emision,
    cuil,
  } = req.body;

  const result = await db.run(
    `INSERT INTO personas (tramite, apellido, nombre, genero, dni, ejemplar, fecha_nacimiento, fecha_emision, cuil)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      tramite,
      apellido,
      nombre,
      genero,
      dni,
      ejemplar,
      fecha_nacimiento,
      fecha_emision,
      cuil,
    ]
  );

  res.json({ id: result.lastID });
});

// GET /personas/:dni
app.get("/personas/:dni", async (req, res) => {
  const dni = req.params.dni;

  const persona = await db.get("SELECT * FROM personas WHERE dni = ?", [dni]);

  if (persona) {
    res.json(persona);
  } else {
    res.status(404).json({ message: "No se encontró la persona con ese DNI" });
  }
});

// PATCH /personas/:id
app.patch("/personas/:id", async (req, res) => {
  const id = req.params.id;
  const {
    tramite,
    apellido,
    nombre,
    genero,
    dni,
    ejemplar,
    fecha_nacimiento,
    fecha_emision,
    cuil,
  } = req.body;

  await db.run(
    `UPDATE personas
     SET tramite = ?, apellido = ?, nombre = ?, genero = ?, dni = ?, ejemplar = ?, fecha_nacimiento = ?, fecha_emision = ?, cuil = ?
     WHERE id = ?`,
    [
      tramite,
      apellido,
      nombre,
      genero,
      dni,
      ejemplar,
      fecha_nacimiento,
      fecha_emision,
      cuil,
      id,
    ]
  );

  res.json({ message: "actualizado" });
});

app.delete("/personas", async (req, res) => {
  await db.run("DELETE FROM personas");
  res.json({ message: "Tabla limpiada" });
});

app.listen(3000, "0.0.0.0", () => {
  console.log("Servidor Express escuchando en http://0.0.0.0:3000");
});