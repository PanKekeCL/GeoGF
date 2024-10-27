const minijuego = require('../models/minijuego');

// Crear un minijuego
exports.crear_minijuego = async (req, res) => {
    try {
        const nuevo_minijuego = new minijuego(req.body);
        const resultado_minijuego = await nuevo_minijuego.save();
        res.status(201).json(resultado_minijuego);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Obtener minijuegos de un administrador específico
exports.leer_minijuegos_por_administrador = async (req, res) => {
    try {
        const { id_administrador } = req.params;
        const resultado_minijuegos = await minijuego.find({ administrador_id: id_administrador }); // Read
        res.json(resultado_minijuegos);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Eliminar un minijuego por su ID
exports.eliminar_minijuego = async (req, res) => {
    try {
        const { id } = req.params;
        const resultado_minijuego = await minijuego.findByIdAndDelete(id); // Delete
        if (!resultado_minijuego) {
            return res.status(404).json({ error: "Minijuego no encontrado" }); // Error: No encontrado
        }
        res.status(204).end(); // Exito
    } catch (error) {
        res.status(500).json({ error: error.message }); // Error
    }
};