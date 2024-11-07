const candidateService = require('../service/candidateServices');

//To get list of all the candidate from all the wards
const allCandidates = async(req, res) => {
    try{
        const candidates = await candidateService.candidateList();
        // Return the list of candidates
        res.status(200).json(candidates);
    }catch(err){
        console.error(err);
        res.status(500).json({ error: "Internal Server error" });
    }
}

//To add the new candidate
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
            return res.status(400).json({ message: checkWard.message });
        }

      //Create a new Candidate document using the Mongoose model
        const newCandidate = await candidateService.addCandidate({ward,party,  ...otherData});
        res.status(200).json({response: newCandidate});
    }catch(err){
      console.log(err);
      res.status(500).json({error: 'Internal Server Error'})
    }
}


//To update the candidate
const updateCandidateData = async(req, res)=>{
    try{
        const admin = await candidateService.checkAdminRole(req.user.id);
        if(!admin)
            return res.status(403).json({messgae: " You are not the admin"})
       
        const candidateId = req.params.candidateId
        const updateCandidateData = await candidateService.updateCandidate(candidateId, req.body);

        if(!updateCandidateData){
            return res.status(404).json({msg: "Candidate ID not found"});
        }
        res.status(200).json(updatedCandidate);
    }catch(err){
        console.error(err);
        res.status(500).json({ error: "Internal Server error" });
    }
}


//To DELETE the Candidate
const  deleteCandidate = async(req, res)=>{
    try{
        const admin = await candidateService.checkAdminRole(req.user.id);
        if(!admin)
            return res.status(403).json({msg: 'You are not the admin'})

        const candidateId = req.params.candidateID;

        const response = await candidateService.removeCandidate(candidateId);

        if(!response)
            return res.status(404).json({error: 'Candidate was not found'});

        console.log('Candidate Deleted');
        res.status(200).json(response);
    }catch(err){
        console.error(err);
        res.status(500).json({error: "Internal server error"})        
    }
}


const votes = async(req, res)=>{
    try {
        // Call the service function to get vote counts
        const voteRecord = await candidateService.getVoteCount();
        
        // Return the vote record as JSON response
        res.status(200).json(voteRecord);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}


module.exports = {allCandidates, 
    addCandidate, 
    updateCandidateData,
    deleteCandidate,
    votes};
