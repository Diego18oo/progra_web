import pool from '../config/db.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import nodemailer from 'nodemailer';
import crypto from 'crypto';


dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1d';

export const registrarUsuario = async (req, res) => {
    console.log(" Body recibido en /registro:", req.body);
  try {
    const { nombre, correo, contrasena, direccion, telefono } = req.body;
    if (!correo || !contrasena) return res.status(400).json({ error: 'Correo y contrasena requeridos' });

    // verifica que no haya un usuario previamente registrado con ese correo
    const [exists] = await pool.query('SELECT id_usuario FROM usuario WHERE correo = ?', [correo]);
    if (exists.length > 0) return res.status(400).json({ error: 'El correo ya está registrado' });
  
    //encriptamos contraseña
    const hashed = await bcrypt.hash(contrasena, 10);

    //insertamos en bd al usuario
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

    //verifica que si haya un usuario con ese correo en la bd
    const [rows] = await pool.query('SELECT * FROM usuario WHERE correo = ?', [correo]);
    if (rows.length === 0) return res.status(401).json({ error: 'Credenciales inválidas' });

    const user = rows[0];

    //desencriptamos contraseña
    const match = await bcrypt.compare(contrasena, user.contrasena);
    if (!match) return res.status(401).json({ error: 'Credenciales inválidas' });


    //creamos token del usuario
    const token = jwt.sign({ id_usuario: user.id_usuario, correo: user.correo, rol: user.rol }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
    console.log('Token decodificado:', jwt.verify(token, JWT_SECRET));


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

export const recuperarPassword = async (req, res) => {
  try {
    const { correo } = req.body;

    const [usuarios] = await pool.query('SELECT * FROM usuario WHERE correo = ?', [correo]);
    if (usuarios.length === 0) {
      return res.status(404).json({ error: 'Correo no encontrado' });
    }

    // Generar token seguro
    const token = crypto.randomBytes(32).toString('hex');
    const expira = new Date(Date.now() + 15 * 60 * 1000); // 15 minutos

    // Guardar token en BD
    await pool.query(
      'UPDATE usuario SET reset_token = ?, reset_token_expira = ? WHERE correo = ?',
      [token, expira, correo]
    );

    // Configurar transport de correo
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      }
    });

    const resetUrl = `http://localhost:4200/restablecer-password?token=${token}`;

    const mensajeHTML = `
      <h2>Restablecer Contraseña</h2>
      <p>Haz clic en el siguiente enlace para crear una nueva contraseña:</p>
      <a href="${resetUrl}" target="_blank">${resetUrl}</a>
      <p>Este enlace expira en 15 minutos.</p>
    `;
    console.log("Enviando correo a:", correo);
    // Enviar correo
    await transporter.sendMail({
      from: `"Soporte" <${process.env.EMAIL_USER}>`,
      to: correo,
      subject: "Restablecer contraseña",
      html: mensajeHTML
    });

    res.json({ mensaje: 'Contraseña restablecida correctamente, revisa tu correo.' });



  } catch (error) {
    console.error('Error en recuperarPassword:', error);
    res.status(500).json({ error: 'Error al recuperar contraseña' });
  }
};


export const actualizarPassword = async (req, res) => {
  try {
    const { token, nuevaContrasena } = req.body;

    const [rows] = await pool.query(
      'SELECT * FROM usuario WHERE reset_token = ? AND reset_token_expira > NOW()',
      [token]
    );

    if (rows.length === 0) {
      return res.status(400).json({ error: 'Token inválido o expirado' });
    }

    const hash = await bcrypt.hash(nuevaContrasena, 10);

    await pool.query(
      'UPDATE usuario SET contrasena = ?, reset_token = NULL, reset_token_expira = NULL WHERE id_usuario = ?',
      [hash, rows[0].id_usuario]
    );

    res.json({ mensaje: 'Contraseña actualizada correctamente' });

  } catch (error) {
    console.error('Error en actualizarPassword:', error);
    res.status(500).json({ error: 'Error al actualizar contraseña' });
  }
};