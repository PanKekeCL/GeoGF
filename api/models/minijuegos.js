const mongoose = require('mongoose');

const minijuegoSchema = new mongoose.Schema({
  nombre_minijuego: { type: String, required: true },
  descripcion: { type: String, required: true },
  estructura: { type: Object, required: true },
  administrador_id: { type: mongoose.Schema.Types.ObjectId, ref: 'administrador', required: true }
});

module.exports = mongoose.model('minijuego', minijuegoSchema);
