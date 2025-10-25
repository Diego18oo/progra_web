import db from '../config/db.js';

export const obtenerProductos = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM producto');
    res.json(rows);
  } catch (err) {
    console.error('Error al obtener productos:', err);
    res.status(500).json({ error: 'Error al obtener los productos' });
  }
};