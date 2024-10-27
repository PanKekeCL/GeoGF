const Plantilla = require('../models/plantillas');

// Leer una plantilla específica por su ID
exports.leer_plantilla = async (req, res) => {
  try {
    const { id } = req.params;
    const plantilla = await Plantilla.findById(id); // Método de Mongoose para buscar por ID
    if (!plantilla) {
      return res.status(404).json({ error: "Plantilla no encontrada" }); // Error
    }
    res.json(plantilla); // Exito
  } catch (error) {
    res.status(500).json({ error: error.message }); // Error
  }
};

// Leer todas las plantillas
exports.leer_plantillas = async (req, res) => {
  try {
    const plantillas = await Plantilla.find(); // Método de Mongoose para buscar todos los documentos
    res.json(plantillas); // Exito
  } catch (error) {
    res.status(500).json({ error: error.message }); // Error
  }
};
