const Candidate = require('../models/candidate');
const User = require('../models/user');
const logger = require('../lib/logger');

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
}

//Check if candidate from same party are in same ward
const checkCandidateWard = async(ward, party)=>{
    try{
        const existingCandidate = await Candidate.findOne({ ward , party});
        if(existingCandidate){
            return {exists:true, message: "the candidate from this ward already exist."}
        }else{
            return {exists: false}
        }
    }catch(err){
        console.log(err);
        return err
    }
}

//Get all the cnaididate list
const candidateList = async()=>{
    try{
        const candidates = await Candidate.find({}, 'name party ward -_id');
        return candidates;
    }catch(err){
        console.error(err);
        throw new Error('Error while getting the list of candidates')
    }
}

//ADD a new Cnadiadate
const addCandidate = async(candidateData)=>{
    try{
        const newCandidate = new Candidate(candidateData);
        return await newCandidate.save();
    }catch(err){
        console.error(err);
        throw new Error('Error creating a new candidate')
    }
}

//Update existing Candidate
const updateCandidate = async (candidateId, updateData) => {
    try {
        const updatedCandidate = await Candidate.findByIdAndUpdate(candidateId, updateData, {
            new: true,
            runValidators: true
        });
        return updatedCandidate;
    }catch(err){
        console.error(err);
        throw new Error('Error updating candidate');
    }
}

// Delete a candidate
const removeCandidate = async (candidateId) => {
    try {
        const deletedCandidate = await Candidate.findByIdAndDelete(candidateId);
        return deletedCandidate;
    }catch (err){
        console.error(err);
        throw new Error('Error deleting candidate');
    }
}

const voteCount = async(req, res)=>{
    try{
        //Find all candidate and sort them by voteCount in descending order
        const candidate = await Candidate.find().sort({voteCount: 'desc'});

        //Map the candidate to only return their name and voteCount
        const voteRecord = candidate.map((data)=>({
                party: data.party,
                count: data.voteCount
        }));
        return voteRecord;
    }catch(err){
        console.log(err);
        res.status(500).json({error: 'Internal Server Error'});
    }
}

module.exports = {checkAdminRole, 
    checkCandidateWard, 
    candidateList, 
    addCandidate, 
    updateCandidate,
    removeCandidate,
    voteCount}