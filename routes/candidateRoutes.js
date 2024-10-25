const express = require('express');
const router = express.Router();
const User = require('./../models/user');
const Candidate = require('./../models/candidate');
const {jwtAuthMiddleware} = require('./../jwt');

//Check whether the user is Admin or not
const checkAdminRole = async (userId) => {
    
    try{
        const user = await User.findById(userId)
        if(user && user.role === 'admin'){
            return true;
        }
        return false
    }catch(err){
        return false;
    }
};

//Get all the candidates with their Name and party
router.get('/candidatesList', async(req, res)=>{

    try {
        
        const candidates = await Candidate.find({}, 'name party -_id');

        // Return the list of candidates
        res.status(200).json(candidates);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal Server error" });
    }
});


//POST route method to add a candidate
router.post('/', jwtAuthMiddleware, async(req, res)=>{
    try{
        const isAdmin = await checkAdminRole(req.user.id);
        if(!isAdmin){
            return res.status(403).json({message: 'user has not admin role'});
        }

      const data = req.body //assuming request body contain candidate data

      //Create a new Candidate document using the Mongoose model
      const newCandidate = new Candidate(data);
      
      // Save the new User to the database
      const response = await newCandidate.save();
      console.log('Data saved');
      res.status(200).json({response: response});
    }catch(err){
      console.log(err);
      res.status(500).json({error: 'Internal Server Error'})
    }
  })
  

//Update the person record
router.put('/:candidateID',jwtAuthMiddleware, async(req, res)=>{
    try{
        if(!checkAdminRole(req.user.id))
            return res.status(403).json({message: `user don't has admin role`});

        const candidateId = req.params.candidateID;
        const updateCandidateData = req.body;

        const response = await Person.findByIdAndUpdate(personId, updateCandidateData,{
            new: true, // Return the updated document
            runValidators: true // Run mongoose validation
        })
        if(!response){
            return res.status(404).json({error: 'Person Id not found'});
        }
        console.log('candidate data Updated');
        res.status(200).json(response);

    }catch(err){
        console.log(err);
        res.status(500).json({error: 'Internal Server Error'});
    }
})


//Delete the candidate
router.delete('/:candidateID',jwtAuthMiddleware, async(req, res)=>{
    try{
        if(!checkAdminRole(req.user.id))
            return res.status(403).json({message: 'user has not admin role'});

        const candidateId = req.params.candidateID;
        const updateCandidateData = req.body;

        const response = await Candidate.findByIdAndDelete(candidateId);

        if(!response){
            return res.status(404).json({error: 'Person Id not found'});
        }
        console.log('candidate deleted');
        res.status(200).json(response);

    }catch(err){
        console.log(err);
        res.status(500).json({error: 'Internal Server Error'});
    }
})

//Check the time whether it is right time to vote or not
const checkVotingTime = (req, res, next) => {
    const currentTime = new Date();
    
    // Set the start and end time for voting
    const startTime = new Date();
    const endTime = new Date();
    
    startTime.setHours(18, 0, 0); // 6:00 PM
    endTime.setHours(18, 30, 0);  // 6:30 PM

    // Check if the current time is within the voting window
    if (currentTime >= startTime && currentTime <= endTime) {
        next(); // Continue to the next middleware if the time is valid
    } else {
        return res.status(403).json({ message: 'Voting is only allowed between 6:00 PM and 6:30 PM' });
    }
};

//Start Voting
router.post('/vote/:candidateID', jwtAuthMiddleware, checkVotingTime, async (req, res)=>{
    console.log("Voting port working" );
    
    const candidateID = req.params.candidateID;
    const userId = req.user.id;

    try{


        //Find the Candidate document with the specified candidateI
        const candidate = await Candidate.findById(candidateID);
        if(!candidate){
            return res.status(404).json({message: 'candidate not found'});
        }
        //Find the user with the specified userId
        const user = await User.findById(userId);
        if(!user){
            return res.status(404).json({message: 'User not found'});
        }
        if(user.role == 'admin'){
            res.status(403).json({message: 'admin can not vote'});
        }
        if(user.isVoted){
            res.status(400).json({message: 'admin is not allowed'});
        }
        //Update the Candidate document to record the vote
        candidate.votes.push({user: userId})
        candidate.voteCount++;
        await candidate.save();

        //Update the user document
        user.isVoted = true
        await user.save();

        res.status(200).json({message: 'Vote recorded successfully'});
    }catch(err){
        console.log(err);
        res.status(500).json({error: 'Internal Server Error'});
    }
});


//vote count
router.get('/votes/count', async (req, res)=>{
    try{
        //Find all candidate and sort them by voteCount in descending order
        const candidate = await Candidate.find().sort({voteCount: 'desc'});

        //Map the candidate to only return their name and voteCount
        const voteRecord = candidate.map((data)=>{
            return {
                party: data.party,
                count: data.voteCount
            }
        });
        return res.status(200).json(voteRecord);
    }catch(err){
        console.log(err);
        res.status(500).json({error: 'Internal Server Error'});
    }
})


module.exports = router;
 