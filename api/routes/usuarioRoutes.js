import express from 'express';
import { registrarUsuario, loginUsuario, obtenerPedidosUsuario, recuperarPassword  } from '../controllers/usuarioController.js';
import { verifyToken } from '../middlewares/authMiddleware.js';
const router = express.Router();

router.post('/registro', registrarUsuario);
router.post('/login', loginUsuario);

router.get('/:id/pedidos', verifyToken, obtenerPedidosUsuario);
router.post('/recuperar', recuperarPassword); 
export default router;
