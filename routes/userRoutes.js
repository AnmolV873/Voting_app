const express = require('express');
const router = express.Router();
const User = require('./../models/user');
const {jwtAuthMiddleware, generateToken} = require('./../jwt');

//To ensure there is only one Admin
const ensureSingleAdmin = async () => {
  try {
      const adminExists = await User.findOne({ role: 'admin' });
      return adminExists ? true : false;
  } catch (err) {
      console.log(err);
      throw new Error('Error checking for existing admin');
  }
};

//Get all the users
router.get('/userlist', async(req, res)=>{
  try{
    const Users = await User.find({}, 'name role -_id')

    res.status(200).json(Users);

  }catch(err){
      console.log(err);
      res.status(500).json({error: 'Internal Server Error'})
  }
});

//POST route method to add a person
router.post('/signup', async(req, res)=>{
    try{
      const data = req.body

      //checking for the existing Admin
      if (data.role === 'admin') {
        const adminAlreadyExists = await ensureSingleAdmin();
        if (adminAlreadyExists) {
            return res.status(400).json({ message: "You can't be admin because an admin already exists." });
        }
    }

      //Create a new User document using the Mongoose model
      const newUser = new User(data);
      
      // Save the new User to the database
      const response = await newUser.save();
      console.log('Data saved');

      const payload = {
        id: response.id
      }

      const token = generateToken(payload);
      console.log('token is : ', token);
      
      res.status(200).json({response: response, token: token});
    }catch(err){
      console.log(err);
      res.status(500).json({error: 'Internal Server Error'})
    }
  });


//Login Route
router.post('/login', async(req, res)=>{
  try{
    //Extraqct AadharCardNumber and password from request body
    const {aadhar, password} = req.body;
    
    
    //Find the user by AadharCardNumber
    const user = await User.findOne({aadhar: aadhar});

    //If user does not exist or password not matches, return err
    if( !user || !(await user.comparePassword(password))){
      return res.status(401).json({error: 'Invalid username or passsord'});
    }

    //generate token
    const payload = {
      id: user.id,
    }
    const token  = generateToken(payload);

    //return token as response
    res.json(token);
  }catch(err){
    console.log(err);
    req.status(500).json({error: 'Internal Server error'});
  }
})


//Profile route
router.get('/profile', jwtAuthMiddleware, async(req, res)=>{
    try{
        const userData = req.user;
        const userId = userData.id;
        const user = await User.findById(userId);
        res.status(200).json(user);
    }catch(err){
        console.log(err);
        res.status(500).json({error: 'Internal Server Error'});   
    }
})


//Update the person record
router.put('/profile/password', jwtAuthMiddleware, async(req, res)=>{
    try{
        const userId = req.user;//Extract the id from the token
        const {currentPassword, newPassword}= req.body;//Extract current and newpassword from request body

        //Find tye user by userId
        const user = await User.findById(userId)

        //If password does not match , return error
        if(!(await user.currentPassword(password))){
            return res.status(401).json({error: 'Invalid username or passsord'});
          }

        //  Update the user's password
        user.password = newPassword;
        await user.save();


        console.log('Password Updated');
        res.status(200).json({message: 'Password Updated'});
    }catch(err){
        console.log(err);
        res.status(500).json({error: 'Internal Server Error'});
    }
})


module.exports = router;
