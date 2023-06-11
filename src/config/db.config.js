const mongoose = require('mongoose')
require('dotenv').config();

const { MONGO_IPSERVER, MONGO_PORT, MONGO_DB } = process.env;

const url = `mongodb://${MONGO_IPSERVER}:${MONGO_PORT}/${MONGO_DB}`;

const dbconnect = () => {
    mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('Connected to MongoDB');
    })
    .catch((error) => {
        console.error('connection error:', error);
    });
};

module.exports = dbconnect;