const mongoose = require('mongoose');
require('dotenv').config();

//define the MongoDB connection URL
// const MongoURL = 'mongodb://localhost:27017/mydatabase';
const MongoURL = process.env.MONGODB_URL;


//Set Up MongoDB connection

// mongoose.connect(MongoURL, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,

// });
mongoose.connect(MongoURL, {
})
.then(() => console.log('Connected to MongoDB server'))
.catch((err) => console.log('MongoDB connection error:', err));

const db = mongoose.connection;

//Define eventlistener for database connection

db.on('connected', () =>{
    console.log('Connected to MongoDB server'); 
})

db.on('error', (err) =>{
    console.log('MongoDB connection error:' , err);
})

db.on('disconnect', ()=>{
    console.log('MongoDB disconnected');
})

module.exports = db
