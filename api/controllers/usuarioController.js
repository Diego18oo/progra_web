import pool from '../config/db.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1d';

export const registrarUsuario = async (req, res) => {
    console.log("📥 Body recibido en /registro:", req.body);
  try {
    const { nombre, correo, contrasena, direccion, telefono } = req.body;
    if (!correo || !contrasena) return res.status(400).json({ error: 'Correo y contrasena requeridos' });

    const [exists] = await pool.query('SELECT id_usuario FROM usuario WHERE correo = ?', [correo]);
    if (exists.length > 0) return res.status(400).json({ error: 'El correo ya está registrado' });

    const hashed = await bcrypt.hash(contrasena, 10);
    const [result] = await pool.query(
      'INSERT INTO usuario (nombre, correo, contrasena, direccion, telefono) VALUES (?, ?, ?, ?, ?)',
      [nombre || null, correo, hashed, direccion || null, telefono || null]
    );

    res.json({ mensaje: 'Usuario registrado', id_usuario: result.insertId });
  } catch (err) {
    console.error('Error detallado al registrar usuario:', err);
    res.status(500).json({ error: 'Error en el servidor' });
  }
};

export const loginUsuario = async (req, res) => {
  try {
    const { correo, contrasena } = req.body;
    if (!correo || !contrasena) return res.status(400).json({ error: 'Correo y contrasena requeridos' });

    const [rows] = await pool.query('SELECT * FROM usuario WHERE correo = ?', [correo]);
    if (rows.length === 0) return res.status(401).json({ error: 'Credenciales inválidas' });

    const user = rows[0];
    const match = await bcrypt.compare(contrasena, user.contrasena);
    if (!match) return res.status(401).json({ error: 'Credenciales inválidas' });

    const token = jwt.sign({ id_usuario: user.id_usuario, correo: user.correo }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

    // No devolver la contrasena
    delete user.contrasena;

    res.json({ mensaje: 'Login exitoso', token, usuario: user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error en el servidor' });
  }
};

export const obtenerPedidosUsuario = async (req, res) => {
  try {
    const { id } = req.params; // id usuario
    // Primero obtenemos los pedidos del usuario
    const [pedidos] = await pool.query('SELECT * FROM pedido WHERE id_usuario = ? ORDER BY fecha_pedido DESC', [id]);

    if (pedidos.length === 0) return res.json([]);

    // Obtener detalles para cada pedido 
    const pedidosConDetalles = [];
    for (const pedido of pedidos) {
      const [detalles] = await pool.query(
        `SELECT dp.id_detalle, dp.id_producto, dp.cantidad, dp.subtotal, p.nombre AS producto_nombre, p.url_imagen
         FROM detalle_pedido dp
         LEFT JOIN producto p ON dp.id_producto = p.id_producto
         WHERE dp.id_pedido = ?`,
        [pedido.id_pedido]
      );

      pedidosConDetalles.push({
        ...pedido,
        detalles
      });
    }

    res.json(pedidosConDetalles);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error en el servidor' });
  }
};
