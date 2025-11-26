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

    const [resultado] = await db.query(
      'INSERT INTO pedido (id_usuario, fecha_pedido, total, estado) VALUES (?, NOW(), ?, "pendiente")',
      [id_usuario, total]
    );

    console.log(" Resultado de pedido:", resultado);
    const id_pedido = resultado.insertId;
    console.log(" Nuevo id_pedido:", id_pedido);

    const detalles = productos.map(p => {
  const idProd = Number(p.id_producto || p.id);
  const cantidad = Number(p.cantidad || 1);
  const precio = Number(p.precio);

  if (isNaN(idProd) || isNaN(cantidad) || isNaN(precio)) {
    throw new Error("Datos inválidos en producto: " + JSON.stringify(p));
  }

  return [
    id_pedido,
    idProd,
    cantidad,
    precio * cantidad
  ];
});
    console.log(" Detalles a insertar:", detalles);

    await db.query(
      'INSERT INTO detalle_pedido (id_pedido, id_producto, cantidad, subtotal) VALUES ?',
      [detalles]
    );

    for (const p of productos) {
      const idProd = Number(p.id_producto || p.id);
      await db.query(
        'UPDATE producto SET stock = stock - ? WHERE id_producto = ? AND stock >= ?',
        [Number(p.cantidad || 1), idProd, Number(p.cantidad || 1)]
      );
    }

    

    console.log(" Detalles insertados correctamente");
    res.json({ mensaje: 'Pedido registrado correctamente', id_pedido });

  } catch (err) {
    console.error("ERROR REAL DEL SERVIDOR:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};
