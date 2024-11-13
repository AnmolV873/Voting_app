const candidateService = require('../service/candidateServices');
const SuccessResponse = require('../lib/success.res');
const ErrorResponse = require('../lib/error.res');


//To get list of all the candidate from all the wards (GET)
const allCandidates = async(req, res) => {
    try{
        const candidates = await candidateService.candidateList();
        // Return the list of candidates
        SuccessResponse.ok(res, 'Candidate successfully created', candidates);
    }catch(err){
        console.error(err);
        ErrorResponse.internalServer('Internal server Error');
    }
}

//To add the new candidate  (PUT)
const addCandidate = async(req, res)=>{
    try{
        //Only Admin can register a candidate
        const isAdmin = await candidateService.checkAdminRole(req.user.id);
        if(!isAdmin){
            return res.status(403).json({message: 'user has not admin role'});
        }
        const {ward, party,  ...otherData} = req.body //assuming request body contain candidate data

        //Check if a Candidate already exist from that ward.
        const checkWard = await candidateService.checkCandidateWard(ward, party);
        if (checkWard.exists) {
            ErrorResponse.badRequest('The candidate already exist');
        }

        //Create a new Candidate document using the Mongoose model
        const newCandidate = await candidateService.addCandidate({ward,party,  ...otherData});
        SuccessResponse.created(res, 'Candidate successfully created', newCandidate);
    }catch(err){
      console.log(err);
      ErrorResponse.internalServer('Internal server Error');
    }
}


//To update the candidate (POST)
const updateCandidateData = async(req, res)=>{
    try{
        const admin = await candidateService.checkAdminRole(req.user.id);
        if(!admin)
            ErrorResponse.forbidden(" You are not the admin");
       
        const candidateId = req.params.candidateId
        const updateCandidateData = await candidateService.updateCandidate(candidateId, req.body);

        if(!updateCandidateData){
            return res.status(404).json({msg: "Candidate ID not found"});
        }
        res.status(200).json(updateCandidateData);
    }catch(err){
        console.error(err);
        ErrorResponse.internalServer('Internal server Error');
    }
}


//To DELETE the Candidate (DELETE)
const  deleteCandidate = async(req, res)=>{
    try{
        const admin = await candidateService.checkAdminRole(req.user.id);
        if(!admin)
            ErrorResponse.forbidden(" You are not the admin");

        const candidateId = req.params.candidateID;

        const response = await candidateService.removeCandidate(candidateId);

        if(!response)
            return res.status(404).json({error: 'Candidate was not found'});

        console.log('Candidate Deleted');
        SuccessResponse.delete(res, 'Candidate successfully created', response);
    }catch(err){
        console.error(err);
        ErrorResponse.internalServer('Internal server Error');        
    }
}


const votes = async(req, res)=>{
    try {
        // Call the service function to get vote counts
        const voteRecord = await candidateService.getVoteCount();
        
        // Return the vote record as JSON response
        SuccessResponse.ok(res, 'Candidate successfully voted', voteRecord);
    } catch (err) {
        console.error(err);
        ErrorResponse.internalServer('Internal server Error');
    }
}


module.exports = {allCandidates, 
    addCandidate, 
    updateCandidateData,
    deleteCandidate,
    votes};
