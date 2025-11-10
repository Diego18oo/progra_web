import express from 'express';
import { crearPedido } from '../controllers/pedidoController.js';
import { verifyToken } from '../middlewares/authMiddleware.js'; //  importa el middleware

const router = express.Router();

//  Protege la ruta: solo usuarios con token válido pueden crear pedidos
router.post('/', (req, res, next) => {
  console.log('Petición recibida en /api/pedidos');
  next();
}, verifyToken, crearPedido);
export default router;
