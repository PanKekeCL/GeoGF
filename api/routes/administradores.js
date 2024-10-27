const express = require('express');
const { createAdministrador, readAdministrador } = require('../controllers/administradores');

const router = express.Router();

// Ruta para crear un administrador
router.post('/', createAdministrador);

// Ruta para obtener todos los administradores
router.get('/', readAdministrador);

module.exports = router;
