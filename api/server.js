require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');

const app = express();
app.use(express.json());

// Conectar a MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log("Conectado a MongoDB"))
  .catch(err => console.error("Error al conectar a MongoDB:", err));

// Rutas
const administradorRoutes = require('./routes/administradores');
const minijuegoRoutes = require('./routes/minijuegos');
const plantillaRoutes = require('./routes/plantillas'); // Asegúrate de que esta ruta esté creada

app.use('/api/administradores', administradorRoutes);
app.use('/api/minijuegos', minijuegoRoutes);
app.use('/api/plantillas', plantillaRoutes); // Asegúrate de que esta ruta esté creada

// Iniciar servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});
