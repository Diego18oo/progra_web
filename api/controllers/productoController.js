import pool from '../config/db.js';

export const crearProducto = async (req, res) => {
  try {
    const { nombre, descripcion, precio, url_imagen, stock } = req.body;

    if (!nombre || !descripcion || !precio || !url_imagen) {
      return res.status(400).json({ error: 'Todos los campos son obligatorios' });
    }

    const [result] = await pool.query(
      'INSERT INTO producto (nombre, descripcion, precio, url_imagen, stock) VALUES (?, ?, ?, ?, ?)',
      [nombre, descripcion, precio, url_imagen, stock]
    );

    res.json({ mensaje: 'Producto creado correctamente', id_producto: result.insertId });
  } catch (err) {
    console.error('Error al crear producto:', err);
    res.status(500).json({ error: 'Error en el servidor' });
  }
};
