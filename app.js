// En `app.js` irá tu código de API REST (CRUD), el servidor http, y lo que creas necesario.

const express = require("express");
const fs = require("fs");
const realizarScraping = require("./scraping");

const app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

let noticias = [];

// Leer datos iniciales del archivo JSON
function leerDatos() {
  try {
    const data = fs.readFileSync("noticias.json", "utf-8");
    noticias = JSON.parse(data);
  } catch (error) {
    console.error("Error al leer el archivo noticias.json:", error.message);
  }
}

// Guardar datos en el archivo JSON
function guardarDatos() {
  fs.writeFileSync("noticias.json", JSON.stringify(noticias, null, 2));
}

// Ejecutar scraping
app.get("/scraping", async (req, res) => {
  await realizarScraping();
  leerDatos();
  res.json({ message: "Scraping realizado y datos actualizados" });
});

// Obtener todas las noticias
app.get("/noticias", (req, res) => {
  res.json(noticias);
});

// Obtener una noticia por índice
app.get("/noticias/:indice", (req, res) => {
  const { indice } = req.params;
  const noticia = noticias[indice];
  if (!noticia) {
    return res.status(404).json({ error: "Noticia no encontrada" });
  }
  res.json(noticia);
});

// Crear una nueva noticia
app.post("/noticias", (req, res) => {
  const { titulo, descripcion, enlace, imagen } = req.body;
  const nuevaNoticia = { titulo, descripcion, enlace, imagen };
  noticias.push(nuevaNoticia);
  guardarDatos();
  res.status(201).json(nuevaNoticia);
});

// Actualizar una noticia existente
app.put("/noticias/:indice", (req, res) => {
  const { indice } = req.params;
  const { titulo, descripcion, enlace, imagen } = req.body;
  const noticia = noticias[indice];
  if (!noticia) {
    return res.status(404).json({ error: "Noticia no encontrada" });
  }
  if (titulo) noticia.titulo = titulo;
  if (descripcion) noticia.descripcion = descripcion;
  if (enlace) noticia.enlace = enlace;
  if (imagen) noticia.imagen = imagen;
  guardarDatos();
  res.json(noticia);
});

// Eliminar una noticia existente
app.delete("/noticias/:indice", (req, res) => {
  const { indice } = req.params;
  if (!noticias[indice]) {
    return res.status(404).json({ error: "Noticia no encontrada" });
  }
  const noticiaEliminada = noticias.splice(indice, 1);
  guardarDatos();
  res.json({ message: "Noticia eliminada", noticia: noticiaEliminada });
});

app.listen(port, () => {
  leerDatos();
  console.log(`Servidor escuchando en http://localhost:${port}`);
});
