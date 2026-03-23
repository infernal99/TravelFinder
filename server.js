const express = require("express");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// base de dades en memòria
let favorites = [];

// servir frontend
app.use(express.static("public"));

// GET favorites
app.get("/favorites", (req, res) => {
    res.json(favorites);
});

// POST favorite (AMB CONTROL DE DUPLICATS)
app.post("/favorites", (req, res) => {

    const country = req.body.country?.toLowerCase().trim();

    if (!country) {
        return res.status(400).json({
            message: "El país és obligatori"
        });
    }

    // evitar duplicats
    const exists = favorites.find(
        f => f.country.toLowerCase() === country
    );

    if (exists) {
        return res.status(400).json({
            message: "Aquest país ja està guardat"
        });
    }

    const newFavorite = {
        id: Date.now(),
        country: req.body.country,
        capital: req.body.capital,
        population: req.body.population,
        flag: req.body.flag
    };

    favorites.push(newFavorite);

    res.status(201).json(newFavorite);
});

// DELETE favorite
app.delete("/favorites/:id", (req, res) => {

    const id = parseInt(req.params.id);

    favorites = favorites.filter(f => f.id !== id);

    res.json({ message: "Destinació eliminada" });
});

// iniciar servidor
app.listen(PORT, () => {
    console.log(`Servidor executant-se a http://localhost:3000`);
});