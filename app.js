const express = require("express");
const path = require("path");
const { leerMascotas, guardarMascotas } = require("./utils/db");

const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));
app.set("view engine", "ejs");

// INCIO
app.get("/", async function (req, res) {
  const mascotas = await leerMascotas();
  res.render("listado", { total: mascotas.length, activo: "inicio" });
});

// LISTADO
app.get("/mascotas", async function (req, res) {
  const nombreBuscar = req.query.nombre;
  const rutBuscar = req.query.rut;
  const todas = await leerMascotas();

  let filtradas = [];

  for (const m of todas) {
    if (
      nombreBuscar &&
      m.nombre.toLowerCase().includes(nombreBuscar.toLowerCase())
    ) {
      filtradas.push(m);
    } else if (rutBuscar && m.rut === rutBuscar) {
      filtradas.push(m);
    } else if (!nombreBuscar && !rutBuscar) {
      filtradas.push(m);
    }
  }

  res.render("listado", {
    mascotas: filtradas,
    nombre: nombreBuscar || "",
    rut: rutBuscar || "",
    activo: "mascotas",
    error: null,
  });
});

// NUEVA MASCOTA
app.get("/mascotas/nueva", function (req, res) {
  res.render("registrar", { activo: "nueva" });
});

// OBTENER MASCOTA
app.get("/api/mascotas", async function (req, res) {
  const nombreBuscar = req.query.nombre;
  const rutBuscar = req.query.rut;
  const todas = await leerMascotas();

  if (nombreBuscar) {
    for (const m of todas) {
      if (m.nombre.toLowerCase() === nombreBuscar.toLowerCase()) {
        return res.json(m);
      }
    }
    return res.status(404).json({ error: "No encontrado" });
  }

  if (rutBuscar) {
    let filtradas = [];
    for (const m of todas) {
      if (m.rut === rutBuscar) {
        filtradas.push(m);
      }
    }
    return res.json(filtradas);
  }

  res.json(todas);
});

// CREAR MASCOTA
app.post("/api/mascotas", async function (req, res) {
  const nombre = req.body.nombre;
  const rut = req.body.rut;

  if (!nombre || !rut) {
    return res.status(400).json({ error: "Faltan datos" });
  }

  const todas = await leerMascotas();

  for (const m of todas) {
    if (m.nombre.toLowerCase() === nombre.trim().toLowerCase()) {
      return res.json({
        exito: false,
        mensaje: "Ya existe la mascota",
      });
    }
  }
  const nueva = { nombre: nombre.trim(), rut: rut.trim() };
  todas.push(nueva);
  await guardarMascotas(todas);
  res.status(201).json({
    exito: true,
    mensaje: "Mascota registrada correctamente",
    mascota: nueva,
  });
});

// ELIMINAR MASCOTA
app.delete("/api/mascotas", async function (req, res) {
  const nombreBuscar = req.query.nombre;
  const rutBuscar = req.query.rut;
  const todas = await leerMascotas();

  let restantes = [];
  let seEliminoAlgo = false;

  for (const m of todas) {
    let debeEliminar = false;

    if (nombreBuscar && m.nombre.toLowerCase() === nombreBuscar.toLowerCase()) {
      debeEliminar = true;
    } else if (rutBuscar && m.rut === rutBuscar) {
      debeEliminar = true;
    }

    if (debeEliminar) {
      seEliminoAlgo = true;
    } else {
      restantes.push(m);
    }
  }

  if (!seEliminoAlgo) {
    return res.status(404).json({ error: "No encontrado" });
  }

  await guardarMascotas(restantes);
  res.json({ mensaje: "Eliminado" });
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
