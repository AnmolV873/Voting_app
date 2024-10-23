const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

//Defining Candidate Schema
const candidateSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    age:{
        type: Number,
    },
    party:{
        type: String,
        required: true
    },
    votes: [
        {
            users:{
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
                require: true
            },
            votedAt:{
                type: Date,
                default: Date.now
            }
        }
    ],
    voteCount:{
        type: Number,
        default: 0
    }
});

//Create User Model
const Candidate = mongoose.model('Candidate', candidateSchema);
module.exports = Candidate;
