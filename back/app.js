const express = require('express');
const mongoose = require('mongoose');
const taskRoutes = require('./routes/taskRoutes');
const cors = require('cors');

const app = express();

// Connexion à MongoDB
mongoose.connect('mongodb://localhost:27017/'+"todoListV2"
).then(() => {
  console.log('Connexion à MongoDB réussie');
}).catch((error) => {
  console.log('Erreur de connexion à MongoDB :', error.message);
});

app.use(cors());
app.use(express.json());

app.use('/tasks', taskRoutes);


// Démarrage du serveur
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
});
