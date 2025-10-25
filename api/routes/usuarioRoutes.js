import express from 'express';
import { registrarUsuario, loginUsuario, obtenerPedidosUsuario } from '../controllers/usuarioController.js';
import { verifyToken } from '../middlewares/authMiddleware.js';
const router = express.Router();

router.post('/registro', registrarUsuario);
router.post('/login', loginUsuario);

// Para obtener pedidos del usuario (protegido), se puede pasar id en params.
// También podrías omitir el id y usar req.user.id_usuario
router.get('/:id/pedidos', verifyToken, obtenerPedidosUsuario);

export default router;
