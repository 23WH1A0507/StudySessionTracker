Study Session Tracker 

1. Introduction 

1.1 Purpose 

This document defines the end-to-end technical design and development guidelines for the Study Session Tracker application. The purpose of this project is to help students record, manage, and analyze their daily study activities in a structured manner. The system focuses on simple CRUD operations while demonstrating real-world full-stack development concepts. 

1.2 Target Audience 

Students who want to track and improve their study habits 

Mentors / faculty who want to monitor student consistency 

Beginners learning full-stack web development 

1.3 Learning Outcomes 

Understanding CRUD operations 

REST API design 

Database schema design 

Authentication and authorization basics 

Frontend–backend integration 

 

2. System Overview 

2.1 User Roles 

Role 

Description 

Student 

Logs in and manages personal study sessions 

Admin 

Views and monitors all students’ study sessions 

2.2 Core Features 

User authentication (Student / Admin) 

Add daily study sessions 

View study history 

Update and delete sessions 

Generate study reports 

 

3. High-Level Architecture 

[ Frontend Application ] 

| 

|------ REST API ------| 

| 

[ Node.js + Express ] 

| 

[ Database ] 

Key Principle 

Simple architecture with clear separation between frontend, backend, and database. 

 

4. Database Design 

4.1 Database 

MongoDB / MySQL 

ORM/ODM: Mongoose / Sequelize 

4.2 Tables / Collections 

4.2.1 users 

{ 
  "_id": "ObjectId", 
  "name": "string", 
  "email": "string", 
  "role": "student | admin", 
  "createdAt": "Date", 
  "updatedAt": "Date" 
} 
 

4.2.2 study_sessions 

{ 
  "_id": "ObjectId", 
  "userId": "ObjectId (ref users)", 
  "subject": "string", 
  "duration": "number", 
  "date": "Date", 
  "createdAt": "Date", 
  "updatedAt": "Date" 
} 
 

 

5. Backend Design 

5.1 Technology Stack 

Node.js 

Express.js 

MongoDB / MySQL 

JWT Authentication 

5.2 Backend Folder Structure 

backend/ 
│── src/ 
│   ├── controllers/ 
│   ├── models/ 
│   ├── routes/ 
│   ├── middleware/ 
│   └── app.js 
│── .env      # environment variables including MongoDB URI and PORT
│── package.json 

**Environment Setup**

Create a `.env` file in the `backend` directory with the following variables:

```dotenv
# MongoDB Atlas connection string, replace <password> if needed
MONGODB_URI=mongodb+srv://pravallika4620_db_user:HwjSSRN87zpJxhyS@studysessiontracker.e6atmte.mongodb.net/StudySessionTracker?retryWrites=true&w=majority

# optional fallback
DATABASE_URI=

# server port
PORT=5000
```

The backend uses `connectDB` in `src/utils/Connect.js` to read `MONGODB_URI` (or
`DATABASE_URI`) and establish a connection to the database.  Ensure the user and
password credentials are valid and the network allows outbound MongoDB Atlas traffic.

Token is used for authorized requests 

5.4 API Endpoints 

Auth APIs 

Method 

Endpoint 

Description 

POST 

/auth/login 

User login 

Study Session APIs 

Method 

Endpoint 

Description 

POST 

/sessions 

Add study session 

GET 

/sessions 

View sessions 

PUT 

/sessions/:id 

Update session 

DELETE 

/sessions/:id 

Delete session 

5.5 Role-Based Access Control 

Students can access only their sessions 

Admin can access all sessions 

 

6. Frontend Design 

6.1 Tech Stack 

HTML, CSS, JavaScript 

React / Angular (optional) 

Axios / Fetch API 

6.2 Folder Structure 

src/ 
├── components/ 
├── pages/ 
├── services/ 
└── App.js 
 

6.3 Key Pages 

Login 

Dashboard 

Session Management 

Reports / History 

 

7. Security Considerations 

JWT-based authentication 

Input validation 

Protected routes 

 

8. Future Enhancements 

Graphical reports and charts 

Study reminders and goals 

Export study history 

Mobile application support 

 

9. Conclusion 

The Study Session Tracker is a simple yet effective CRUD-based application that helps students build discipline and consistency in their studies while providing hands-on experience with full-stack web development concepts. 

Project Name: Study Session Tracker 

 