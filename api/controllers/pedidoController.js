import db from '../config/db.js';

export const crearPedido = async (req, res) => {
  try {
    console.log(" Usuario autenticado:", req.user);
    console.log(" Body recibido:", req.body);

    const { productos, total } = req.body;
    const { id_usuario } = req.user;

    if (!id_usuario) {
      return res.status(401).json({ error: 'Usuario no autenticado' });
    }

    //  Insertar el pedido
    const [resultado] = await db.query(
      'INSERT INTO pedido (id_usuario, fecha_pedido, total, estado) VALUES (?, NOW(), ?, "pendiente")',
      [id_usuario, total]
    );

    console.log(" Resultado de pedido:", resultado);
    const id_pedido = resultado.insertId;
    console.log(" Nuevo id_pedido:", id_pedido);

    //  Preparar los detalles
    const detalles = productos.map(p => [
      id_pedido,
      Number(p.id_producto),
      Number(p.cantidad || 1),
      Number(p.precio) * Number(p.cantidad || 1)
    ]);
    console.log(" Detalles a insertar:", detalles);

    //  Insertar los detalles del pedido
    await db.query(
      'INSERT INTO detalle_pedido (id_pedido, id_producto, cantidad, subtotal) VALUES ?',
      [detalles]
    );

    for (const p of productos) {
      await db.query(
        'UPDATE producto SET stock = stock - ? WHERE id_producto = ? AND stock >= ?',
        [Number(p.cantidad || 1), Number(p.id_producto), Number(p.cantidad || 1)]
      );
    }

    

    console.log(" Detalles insertados correctamente");
    res.json({ mensaje: 'Pedido registrado correctamente', id_pedido });

  } catch (err) {
    console.error(" Error al crear pedido:", err);
    res.status(500).json({ error: 'Error al registrar pedido', detalle: err });
  }
};
