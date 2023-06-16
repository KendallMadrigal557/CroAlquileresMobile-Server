const Favorite = require("../models/favorite.model");

function validateFavoriteData(req, res, next) {
    const { iduser, idDepartment } = req.body;
    if (!iduser || !idDepartment) {
        return res
            .status(400)
            .json({ message: "El id del usuario y el id del departamento son obligatorios." });
    }

    next();
}

function createFavorite(req, res) {
    const { iduser, idDepartment } = req.body;
    const newFavorite = new Favorite({
        iduser,
        idDepartment
    });

    newFavorite
        .save()
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
}

function getFavorites(req, res) {
    const { userid } = req.query; 

    Favorite.find({ iduser: userid })
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
}

function getFavoriteById(req, res) {
    const { id } = req.params;
    Favorite.findById(id)
        .then((data) => {
            if (!data) {
                return res.status(404).json({ message: "Favorito no encontrado." });
            }
            res.json(data);
        })
        .catch((error) => res.json({ message: error }));
}

function deleteFavorite(req, res) {
    const { id } = req.params;
    Favorite.findByIdAndDelete(id)
        .then((data) => {
            if (!data) {
                return res.status(404).json({ message: "Favorito no encontrado." });
            }
            res.json(data);
        })
        .catch((error) => res.json({ message: error }));
}

module.exports = {
    validateFavoriteData,
    createFavorite,
    getFavorites,
    getFavoriteById,
    deleteFavorite,
};
