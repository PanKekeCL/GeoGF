const mongoose = require('mongoose');

const administradorSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  correo: { type: String, required: true, unique: true },
  contrasena: { type: String, required: true }
});

module.exports = mongoose.model('administrador', administradorSchema);
