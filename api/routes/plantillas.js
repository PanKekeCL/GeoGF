const express = require('express');
const { leer_plantilla, leer_plantillas } = require('../controllers/plantillas');

const router = express.Router();

// Ruta para leer todas las plantillas
router.get('/', leer_plantillas);

// Ruta para leer una plantilla específica por su ID
router.get('/:id', leer_plantilla);

module.exports = router;
