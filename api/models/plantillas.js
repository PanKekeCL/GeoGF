const mongoose = require('mongoose');

const plantillaSchema = new mongoose.Schema({
  tipo: { type: String, required: true },
  descripcion: { type: String, required: true },
  plantilla: { type: Object, required: true } // Almacena un JSON como tipo Object
});

module.exports = mongoose.model('plantillas', plantillaSchema);
