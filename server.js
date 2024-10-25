const express = require('express');
const app = express();
require('dotenv').config();
const mongoose = require('mongoose');
const db = require('./db');


const bodyParser = require('body-parser');
app.use(bodyParser.json());

const PORT = process.env.PORT || 3000;

//Import the routes
const UserRoutes = require('./routes/userRoutes');
const candidateRoutes = require('./routes/candidateRoutes');


//Use the routes
app.use('/user', UserRoutes);
app.use('/candidate', candidateRoutes)

app.listen(PORT , ()=>{
    console.log('Port is running');
})
