import express from 'express';
import { crearPedido } from '../controllers/pedidoController.js';
import { verifyToken } from '../middlewares/authMiddleware.js'; 

const router = express.Router();

router.post('/', (req, res, next) => {
  console.log('Petición recibida en /api/pedidos');
  next();
}, verifyToken, crearPedido);
export default router;
