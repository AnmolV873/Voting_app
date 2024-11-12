
# Voting Application
This is a Voting Application built with Node.js, Express, and MongoDB.The app implements role-based access, where only admin users have the rights to add, update, or delete candidates, while regular users can view candidate details and cast their votes.




## Features

- User Authentication: Users can sign up, log in, and receive JWT tokens for secure access.
- Admin Role: Only users with an admin role can manage candidates.
- Candidate Management: Admins can add, update, and delete candidates.
- Ward-Based Voting: Voters can only vote for candidates in the same ward.
- Vote Count: Retrieve and display vote counts for each candidate, sorted by popularity.


## Technology Used

**Backend:** Node.js, Express

**Database:** MongoDB

**Authentication:** JSON Web Tokens (JWT)

**Response Handling:** Custom SuccessResponse class



## Installation

Clone the repository:

Copy code

git clone https://github.com/AnmolV873/Voting_app.git
cd voting-app

Install dependencies:

Copy code -> npm install

Start the server:

Copy code -> npm start

## ROUTES

**User Authentication:**
-  /Signin: POST - user is already existing
-  /SignUp: POST - New user created [ aadharcard + password]

**Voting:**
- /candidate: GET - get the list of candidates
- /vote/:candidateID :  POST - vote for a specific candidate

**Vote Count:**
- /votes/ count: GET - get the list of candidate sorted by their number of votes

**User Profile:**
- profile: GET - get the user info
- profile/password: PATCH - update password
    

**Admin candidate Management:**
- candidates: PUT - add the name of candidates
- candidate/candidateID: PUT - update the existing candidate
- candidate/candidateID: DELETE - delete the existing candidate


    
## Lesson Learned
This project taught me several valuable lessons:

**Separation of Concerns:** By separating the controller and service layers, I learned the importance of modularizing business logic for maintainability and clarity.

**Role-Based Access Management:** Implementing role-based restrictions deepened my understanding of secure access control and fine-grained permissions.

**JWT Authentication:** Setting up token-based authentication highlighted the strengths and potential challenges of sessionless security.

**Error Handling and Custom Responses:** Creating a SuccessResponse class for standardized success responses helped streamline API communication and provided a smoother development process.

**Data Integrity:** Ensuring each voter could only vote within their ward and that only one candidate per party was allowed per ward gave me experience with data validation and integrity.



## Future Improvement
- **Enhanced Logging and Error Tracking:** Integrate a logging framework for more granular error and request tracking.
- **User-Friendly Frontend:** Develop a frontend interface for easier access and usability.
- **Unit and Integration Testing:** Increase test coverage for critical functions to ensure reliability and prevent regressions.
