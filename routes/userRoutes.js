const express = require('express');
const router = express.Router();
const User = require('./../models/user');
const {jwtAuthMiddleware} = require('./../jwt');
const {getUsers, addVoter, loginVoter, updatePasswordController} = require('../controllers/user.contoller')

//Get all the users
router.route('/users').get(getUsers);

//POST route method to add a person
router.route('/signup').post(addVoter);
    
//Login Route
router.route('/login').post(loginVoter);
 
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
router.route('/profile/password').put(jwtAuthMiddleware, updatePasswordController);

module.exports = router;
