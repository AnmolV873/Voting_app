const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

//Defining User Schema
const UserSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    age:{
        type: Number,
    },
    mobile:{
        type: String,
        required: true,
    },
    address:{
        type: String,
        required: true
    },
    aadhar:{
        type: Number,
        required: true,
        unique: true
    },
    password:{
        type: String,
        required: true
    },
    role:{
        type: String,
        enum: ['admin', 'voter'],
        default: 'voter'
    },
    isVoted:{
        type: Boolean,
        default: false
    },
    ward:{
        type: String,
        enum:['ward1', 'ward2', 'ward3', 'ward4'],
        required: true
    }
});


UserSchema.pre('save', async function (next){
    const User = this;
 
    //Hash password only if it has been modified or it's new
    if(!User.password || !User.isModified('password')) return next();
    try{
        //hash password generation or generating a salt
        const salt = await bcrypt.genSalt(10);

        //hash password with salt
        const hashpassword = await bcrypt.hash(User.password, salt);

        //Override the plain password with the hashed one
        User.password = hashpassword;
        next();
    }catch(err){
        return next(err);
    }
})


UserSchema.methods.comparePassword = async function(candidatePassword) {
    try{
        //Use bcrypt to compare the provided password with the hashed password
        const isMatch = await bcrypt.compare(candidatePassword, this.password);
        return await isMatch;
    }catch(err){
        throw err; 
    }   
}



//Create User Model
const User = mongoose.model('User', UserSchema);
module.exports = User;
