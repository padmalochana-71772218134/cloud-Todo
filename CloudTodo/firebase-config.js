// firebase-config.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyAqd04YDYwFIGVT1xQBUyLaO35LwuRikJ4",
  authDomain: "cloudtodo-9a4da.firebaseapp.com",
  projectId: "cloudtodo-9a4da",
  storageBucket: "cloudtodo-9a4da.firebasestorage.app",
  messagingSenderId: "983499503316",
  appId: "1:983499503316:web:5610d1fd455e3b83152d41",
  measurementId: "G-LN13D3QHLQ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
