const User  = require('./../models/user');

//Fetch ALL user 
const fetchUser = async()=>{
    try{
        return await User.find({}, 'name ward -_id');  
    }catch(err){
        console.error(err);
        throw new Error('Internal server error');
    }
}

//To ensure there is only one Admin
const ensureSingleAdmin = async () => {
    try {
        const adminExists = await User.findOne({ role: 'admin' });
        return adminExists ? true : false;
    } catch (err) {
        console.log(err);
        throw new Error('Error checking for existing admin');
    }
}

//To add new candidate
const addNewVoter = async(data)=>{
    try{
        const newVoter = new User(data);
        return await newVoter.save();
    }catch(err){
        console.log(err);
        throw new Error('Error while adding new Voter');
    }
}

//Login existing user
const verifyUserCredentials = async(req, res)=>{
    try{
        const user = await User.findOne({ aadhar });
        if (!user || !(await user.comparePassword(password))) {
            throw new Error('Invalid username or password');
        }
        return user;  
    }catch(err){
        console.log(err);
        throw new Error('please check aadharcard or password');
    }
}

//Update existing voter
const updateProfileRecord = async(userId, currentPassword, newPassword)=>{
    try{
        const user = await User.findById(userId);
        if(!(await user.comparePassword(currentPassword))){
            throw new Error('Invalid current password');
        }
        user.password = newPassword;
        return await user.save();
    }catch(err){
        console.error(err);
        throw new Error('Error updating password');
    }
}


module.exports = {fetchUser, ensureSingleAdmin, addNewVoter,verifyUserCredentials,updateProfileRecord}
