const administrador = require('../models/administradores');

// Crear un administrador
exports.createAdministrador = async (req, res) => {
  try {
    const nuevoAdmin = new administrador(req.body); // Crea un nuevo administrador segun un JSON
    const adminGuardado = await nuevoAdmin.save();
    res.status(201).json(adminGuardado);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Leer administrador por correo
exports.readAdministradorByCorreo = async (req, res) => {
  try {
    const admin = await administrador.findOne({ correo: req.params.correo });
    
    if (!admin) {
      return res.status(404).json({ message: 'Administrador no encontrado' });
    }
    
    res.json(admin);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Actualizar un administrador por _id
exports.updateAdministrador = async (req, res) => {
  try {
    const updatedAdmin = await administrador.findByIdAndUpdate(req.params.id, req.body, { new: true });

    if (!updatedAdmin) {
      return res.status(404).json({ message: 'Administrador no encontrado' });
    }

    res.json(updatedAdmin);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Eliminar un administrador
exports.deleteAdministrador = async (req, res) => {
  try {
    const adminEliminado = await administrador.findOneAndDelete({ correo: req.params.correo });
    
    if (!adminEliminado) {
      return res.status(404).json({ message: 'Administrador no encontrado' });
    }
    
    res.json({ message: 'Administrador eliminado con éxito' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
