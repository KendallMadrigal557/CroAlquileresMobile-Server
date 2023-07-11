const Place = require('../models/place.model');

function validatePlaceData(req, res, next) {
    const { provincia, cantones } = req.body;
    if (!provincia || !cantones || cantones.length === 0) {
        return res.status(400).json({ message: 'Todos los campos son obligatorios.' });
    }

    next();
}

function createPlace(req, res) {
    const { provincia, cantones } = req.body;
    const newProvincia = new Place({
        provincia,
        cantones
    });

    newProvincia
        .save()
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
}

function getPlace(req, res) {
    Place.find()
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
}

function getPlaceById(req, res) {
    const { id } = req.params;
    Place.findById(id)
        .then((data) => {
            if (!data) {
                return res.status(404).json({ message: 'Place no encontrada.' });
            }
            res.json(data);
        })
        .catch((error) => res.json({ message: error }));
}

function updatePlace(req, res) {
    const { id } = req.params;
    const { provincia, cantones } = req.body;
    Place.findByIdAndUpdate(id, { provincia, cantones }, { new: true })
        .then((data) => {
            if (!data) {
                return res.status(404).json({ message: 'Place no encontrada.' });
            }
            res.json(data);
        })
        .catch((error) => res.json({ message: error }));
}

function deletePlace(req, res) {
    const { id } = req.params;
    Place.findByIdAndDelete(id)
        .then((data) => {
            if (!data) {
                return res.status(404).json({ message: 'Place no encontrada.' });
            }
            res.json(data);
        })
        .catch((error) => res.json({ message: error }));
}

module.exports = {
    validatePlaceData,
    createPlace,
    getPlace,
    getPlaceById,
    updatePlace,
    deletePlace,
};