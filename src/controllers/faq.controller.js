const FAQ = require("../models/faq.model");

function validateFAQData(req, res, next) {
    const { question, answer } = req.body;

    if (!question || !answer) {
        return res
            .status(400)
            .json({ message: "La pregunta y la respuesta son obligatorias." });
    }

    next();
}

function createFAQ(req, res) {
    const { question, answer } = req.body;
    const newFAQ = new FAQ({
        question,
        answer,
    });

    newFAQ
        .save()
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
}

function getFAQs(req, res) {
    FAQ.find()
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
}

function getFAQById(req, res) {
    const { id } = req.params;
    FAQ.findById(id)
        .then((data) => {
            if (!data) {
                return res.status(404).json({ message: "Pregunta frecuente no encontrada." });
            }
            res.json(data);
        })
        .catch((error) => res.json({ message: error }));
}

function updateFAQ(req, res) {
    const { id } = req.params;
    const { question, answer } = req.body;
    FAQ.findByIdAndUpdate(id, { question, answer }, { new: true })
        .then((data) => {
            if (!data) {
                return res.status(404).json({ message: "Pregunta frecuente no encontrada." });
            }
            res.json(data);
        })
        .catch((error) => res.json({ message: error }));
}

function deleteFAQ(req, res) {
    const { id } = req.params;
    FAQ.findByIdAndDelete(id)
        .then((data) => {
            if (!data) {
                return res.status(404).json({ message: "Pregunta frecuente no encontrada." });
            }
            res.json(data);
        })
        .catch((error) => res.json({ message: error }));
}

module.exports = {
    validateFAQData,
    createFAQ,
    getFAQs,
    getFAQById,
    updateFAQ,
    deleteFAQ,
};
