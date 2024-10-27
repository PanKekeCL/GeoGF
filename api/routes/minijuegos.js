const express = require('express');
const { crear_minijuego, leer_minijuegos_por_administrador, eliminar_minijuego } = require('../controllers/minijuegos');

const router = express.Router();

// Ruta para crear un minijuego
router.post('/', crear_minijuego);

// Ruta para obtener los minijuegos de un administrador específico
router.get('/administrador/:id_administrador', leer_minijuegos_por_administrador);

// Ruta para eliminar un minijuego por su ID
router.delete('/:id', eliminar_minijuego);

module.exports = router;
