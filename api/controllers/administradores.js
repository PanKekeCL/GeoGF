const administrador = require('../models/administradores');

// Crear un administrador
exports.createAdministrador = async (req, res) => {
  try {
    const nuevoAdmin = new administrador(req.body);
    const adminGuardado = await nuevoAdmin.save();
    res.status(201).json(adminGuardado);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Obtener todos los administradores
exports.readAdministrador = async (req, res) => {
  try {
    const administradores = await administrador.find();
    res.json(administradores);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
