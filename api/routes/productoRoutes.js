import express from 'express';
import { crearProducto } from '../controllers/productoController.js';
import { verifyToken } from '../middlewares/authMiddleware.js';
import { verificarAdmin } from '../middlewares/roleMiddleware.js';

const router = express.Router();

router.post('/', verifyToken, verificarAdmin, crearProducto);
console.log('Rutas de productos cargadas');
export default router;
