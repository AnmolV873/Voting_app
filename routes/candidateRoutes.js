const express = require('express');
const router = express.Router();
const User = require('../models/user');
const Candidate = require('./../models/candidate');
const {jwtAuthMiddleware} = require('./../jwt');
const{allCandidates, addCandidate, updateCandidateData, deleteCandidate, votes} = require('../controllers/candidate.controller');

const checkUserWard = async(userId)=>{
    try{
        const user = await User.findById(userId);
        return user ? user.ward : null;
    }catch(err){
        console.error("Error fetching user ward:", err);
        return null;        
    }
}

const CandidateWard = Candidate.ward;
const isSimilarWard = async(req, res, next)=>{
    try{
        const userWard = await checkUserWard(req.user.id);
        const candidateWard = req.body.ward;
        if(userWard === candidateWard){
            next();
        }else{
            return res.status(400).json({message: "user ward and candidate ward are different"})
        }
    }catch (error) {
        console.error("Error checking wards:", error);
        return false;
    }
}


//Get all the candidates with their Name and party
router.route('/candidatesList').get(allCandidates);


//POST route method to add a candidate
router.route('/').post(jwtAuthMiddleware, addCandidate);

//Update the person record
router.route('/:candidateID').put(jwtAuthMiddleware, updateCandidateData);

//Delete the candidate
router.route('/:candidateId').delete(jwtAuthMiddleware, deleteCandidate);

//Check the time whether it is right time to vote or not
const checkVotingTime = (req, res, next) => {
    const currentTime = new Date();
    
    // Set the start and end time for voting
    const startTime = new Date();
    const endTime = new Date();
    
    startTime.setHours(11, 0, 0); // 11:00 AM
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
        const sameWard = await isSimilarWard(userId, candidateID);
        if(sameWard){
            return res.status(403).json({ message: 'Voter is from a different ward' });
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
router.route('/votes/count').get(votes);

module.exports = router;
 