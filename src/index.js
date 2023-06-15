const express = require('express');
const dbconnect = require('./config/db.config');
const app = express();
const port = process.env.PORT || 3002;
const departmentRouter = require('./routes/department.routes');
const userRouter = require('./routes/user.routes');
const reviewRouter = require('./routes/review.routes');
const faqRoutes = require('./routes/faq.routes');

const multer = require('multer');
const path = require('path');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api', departmentRouter);
app.use('/api', userRouter);
app.use('/api', reviewRouter);
app.use('/api', faqRoutes);

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    return res.status(400).json({ message: 'Error al subir el archivo. Verifica el formato y vuelve a intentarlo.' });
  } else if (err) {
    return res.status(500).json({ message: err.message });
  }
  next();
});

app.get('/', (req, res) => {
  res.send('Welcome to my API');
});

app.get('/uploads/:filename', (req, res) => {
  const filename = req.params.filename;
  const imagePath = path.join(__dirname, 'uploads', filename);
  res.sendFile(imagePath);
});

app.listen(port, () => {
  console.log('Server listening on port', port);
});

dbconnect();

module.exports = app;
