require('dotenv').config();                 //For environement variables (not to show passwords in public source code)
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const helmet = require('helmet');
const userRoutes = require('./routes/userRoutes');
const app = express();

app.use(helmet());                        //For securized HTTP headers (against XSS attacks)
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
  });
app.use(bodyParser.json());
/*app.use('/images', express.static(path.join(__dirname, 'images')));*/
app.use('/api', userRoutes); 
module.exports = app;