import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import usuarioRoutes from './routes/usuarioRoutes.js';

import catalogoRoutes from './routes/catalogoRoute.js';
import pedidoRoutes from './routes/pedidoRoutes.js';
dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

// Rutas
app.use('/api/catalogo', catalogoRoutes);
app.use('/api/pedidos', pedidoRoutes);
app.use('/api/usuarios', usuarioRoutes);
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});
