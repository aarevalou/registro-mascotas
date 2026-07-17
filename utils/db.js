const fs = require('fs').promises;
const path = require('path');

const DB_PATH = path.join(__dirname, '..', 'data', 'mascotas.json');

async function leerMascotas() {
  try {
    const contenido = await fs.readFile(DB_PATH, 'utf-8');
    return JSON.parse(contenido || '[]');
  } catch (error) {
    if (error.code === 'ENOENT') return [];
    throw error;
  }
}

async function guardarMascotas(mascotas) {
  await fs.writeFile(DB_PATH, JSON.stringify(mascotas, null, 2), 'utf-8');
}

module.exports = { leerMascotas, guardarMascotas };
