const {generateToken} = require('../jwt');
const userServices = require('../service/userServices');

//to GET all the users listed
const getUsers = async(req, res)=>{
    try{
        const users = await userServices.fetchUser();
        res.status(200).json(users);
    }catch(error){
console.error(err);
    res.status(500).json({ error: "Internal Server error" }); 
    }
}


//ENsure there is only one admin
const singleAdmin = async (req, res, next)=>{
    try{
        if(await userServices.ensureSingleAdmin()){
            return res.status(400).json({ error: 'An admin already exists' });
        }
        next();
    }catch (error) {
        res.status(500).json({ error: 'Internal Server error' });
    }
}

//TO ADD a new Voter
const addVoter = async(req, res)=>{
    try{
        const newUser = await userServices.addNewVoter(req.body);
        res.status(201).json(newUser);
    }catch(error){
        console.error(error);
        res.status(500).json({error: 'Internal server error'})   
    }
}

//Login an existing user/Voter
const loginVoter = async(req, res)=>{
    try{
        const { aadhar, password } = req.body;
        const user = await userServices.verifyUserCredentials(aadhar, password);
        const token = generateToken({ id: user.id });
        res.json(token);
    }catch(error){
        console.error(error);
        res.status(500).json({error: 'Internal server error'})
    }
}

//Update the person record
const updatePasswordController = async (req, res) => {
    const { userId, currentPassword, newPassword } = req.body;

    try {
        // Call the service function to update the password
        const updatedUser = await userServices.updateProfileRecord(userId, currentPassword, newPassword);

        // Respond with a success message
        res.status(200).json({
            message: 'Password updated successfully',
            user: updatedUser
        });
    } catch (err) {
        // Handle any errors from the service
        res.status(400).json({
            message: err.message || 'Failed to update password'
        });
    }
};

module.exports = {getUsers, addVoter, loginVoter, updatePasswordController, singleAdmin}
