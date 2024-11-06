const express = require('express');
const router = express.Router();
const controller = require('../controllers/administradores');

// Crear un administrador
router.post('/createAdministrador', controller.createAdministrador);

// Leer administrador por correo
router.get('/readAdministrador/:correo', controller.readAdministradorByCorreo);

// Actualizar administrador por id
router.get('/updateAdministrador/:id', controller.updateAdministrador);

// Eliminar administrador por id
router.get('/deleteAdministrador/:id', controller.deleteAdministrador);

module.exports = router;
