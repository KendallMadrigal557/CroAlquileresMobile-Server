const Review = require('../models/review.model');

function validateReviewData(req, res, next) {
    const { idUser, idDepartment, review, date } = req.body;
    if (!idUser || !idDepartment || !review || !date) {
        return res.status(400).json({ message: 'Todos los campos son obligatorios.' });
    }

    next();
}

function createReview(req, res) {
    const { idUser, idDepartment, review, date } = req.body;
    const newReview = new Review({
        idUser,
        idDepartment,
        review,
        date
    });

    newReview
        .save()
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
}

function getReviews(req, res) {
    const { departmentId } = req.query;
    Review.find({ idDepartment: departmentId })
        .populate('idUser', 'username') 
        .populate('idDepartment', 'place') 
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
}


function getReviewById(req, res) {
    const { id } = req.params;
    Review.findById(id)
        .populate('idUser', 'username') 
        .populate('idDepartment', 'place') 
        .then((data) => {
            if (!data) {
                return res.status(404).json({ message: 'Revisión no encontrada.' });
            }
            res.json(data);
        })
        .catch((error) => res.json({ message: error }));
}

function updateReview(req, res) {
    const { id } = req.params;
    const { review } = req.body;
    Review.findByIdAndUpdate(id, { review }, { new: true })
        .then((data) => {
            if (!data) {
                return res.status(404).json({ message: 'Revisión no encontrada.' });
            }
            res.json(data);
        })
        .catch((error) => res.json({ message: error }));
}

function deleteReview(req, res) {
    const { id } = req.params;
    Review.findByIdAndDelete(id)
        .then((data) => {
            if (!data) {
                return res.status(404).json({ message: 'Revisión no encontrada.' });
            }
            res.json(data);
        })
        .catch((error) => res.json({ message: error }));
}

module.exports = {
    validateReviewData,
    createReview,
    getReviews,
    getReviewById,
    updateReview,
    deleteReview,
};
