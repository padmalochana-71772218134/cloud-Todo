Cloud To-Do List

Cloud To-Do List is a web-based task management application that allows users to securely manage their tasks using Firebase Authentication and Cloud Firestore. Each user has access to their own tasks only, and all data is stored in the cloud for real-time access from any device.

Features
User Authentication
  - Sign up, log in, and log out
  - Email verification support
  - Firebase authentication state observer
Task Management
  - Add new tasks with selectable priority (Low, Normal, High)
  - View tasks with creation timestamp
  - Mark tasks as done or delete them
  - Real-time synchronization with Firestore
Security
  - Each user's data is securely stored and isolated
  - Firebase Firestore rules to restrict access to authorized users only

Project Structure

CloudToDo/
│
├── index.html 
├── style.css 
├── app.js 
├── README.md
└── /firebase-config 

Tech Stack
- Frontend: HTML, CSS, JavaScript (Vanilla)
- Backend: Firebase (Auth + Firestore)
- Authentication: Firebase Email/Password
- Realtime DB: Firebase Firestore

