// Firebase Config
const firebaseConfig = {
  apiKey: "AIzaSyAqd04YDYwFIGVT1xQBUyLaO35LwuRikJ4",
  authDomain: "cloudtodo-9a4da.firebaseapp.com",
  projectId: "cloudtodo-9a4da",
  storageBucket: "cloudtodo-9a4da.appspot.com",
  messagingSenderId: "983499503316",
  appId: "1:983499503316:web:5610d1fd455e3b83152d41",
  measurementId: "G-LN13D3QHLQ"
};

// Initialize Firebase App & Services (modular syntax)
const app = firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

let unsubscribeTasks = null;

// Sign Up
window.signup = async function () {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  try {
    await auth.createUserWithEmailAndPassword(email, password);
    await auth.currentUser.sendEmailVerification();
    alert("Signup successful! Check your inbox to verify your email.");
  } catch (error) {
    alert("Signup Error: " + error.message);
  }
};

// Login
window.login = async function () {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  try {
    await auth.signInWithEmailAndPassword(email, password);
  } catch (error) {
    alert("Login Error: " + error.message);
  }
};

// Logout
window.logout = function () {
  auth.signOut().then(() => {
    // Clear input fields
    document.getElementById("email").value = "";
    document.getElementById("password").value = "";

    // Show login section and hide todo
    document.getElementById("auth").style.display = "block";
    document.getElementById("todo").style.display = "none";

    // Optional alert
    alert("You have been logged out. Please login again.");
  }).catch((error) => {
    alert("Logout failed: " + error.message);
  });
};



// Resend Verification
window.resendVerification = async function () {
  const user = auth.currentUser;
  if (user && !user.emailVerified) {
    await user.sendEmailVerification();
    alert("Verification email sent.");
  }
};

// Add Task (with priority and done)
window.addTask = async function () {
  const input = document.getElementById("taskInput");
  const priority = document.getElementById("priorityInput")?.value || "Normal";
  const task = input.value.trim();
  const user = auth.currentUser;

  if (!user || !user.emailVerified || !task) {
    alert("Please enter a task and verify your email.");
    return;
  }

  try {
    const userTasksRef = db.collection("users").doc(user.uid).collection("tasks");
    await userTasksRef.add({
      task,
      priority,
      done: false,
      timestamp: firebase.firestore.FieldValue.serverTimestamp()
    });
    input.value = "";
  } catch (error) {
    alert("Error adding task: " + error.message);
  }
};

// Task Listener
function startTaskListener(uid) {
  const taskList = document.getElementById("taskList");
  const userTasksRef = db.collection("users").doc(uid).collection("tasks").orderBy("timestamp", "asc");

  if (unsubscribeTasks) unsubscribeTasks();

  unsubscribeTasks = userTasksRef.onSnapshot(snapshot => {
    taskList.innerHTML = "";

    if (snapshot.empty) {
      const li = document.createElement("li");
      li.textContent = "No tasks found.";
      taskList.appendChild(li);
      return;
    }

    snapshot.forEach(docSnap => {
      const data = docSnap.data();
      const li = document.createElement("li");

      const taskText = document.createElement("div");
      taskText.className = "task-text";
      if (data.done) taskText.classList.add("done");
      taskText.textContent = `${data.task} (${data.priority})`;

      const timestamp = data.timestamp?.toDate().toLocaleString() || "Unknown";

      const info = document.createElement("div");
      info.className = "small";
      info.textContent = `Created: ${timestamp}`;

      const doneBtn = document.createElement("button");
      doneBtn.className = "delete-btn";
      doneBtn.style.background = data.done ? "#3498db" : "#2ecc71";
      doneBtn.textContent = data.done ? "Mark To-Do" : "Mark Done";
      doneBtn.onclick = async (e) => {
        e.stopPropagation();
        try {
          await db.collection("users").doc(uid).collection("tasks").doc(docSnap.id).update({
            done: !data.done
          });
        } catch (error) {
          alert("Failed to update task status: " + error.message);
        }
      };

      const delBtn = document.createElement("button");
      delBtn.textContent = "Delete";
      delBtn.className = "delete-btn";
      delBtn.onclick = async (e) => {
        e.stopPropagation();
        const confirmDelete = confirm("Delete this task?");
        if (!confirmDelete) return;
        try {
          await db.collection("users").doc(uid).collection("tasks").doc(docSnap.id).delete();
        } catch (error) {
          alert("Error deleting task: " + error.message);
        }
      };

      li.appendChild(taskText);
      li.appendChild(info);

      const btnRow = document.createElement("div");
      btnRow.style.marginTop = "5px";
      btnRow.appendChild(doneBtn);
      btnRow.appendChild(delBtn);

      li.appendChild(btnRow);
      taskList.appendChild(li);
    });
  }, error => {
    console.error("Task listener error:", error);
    alert("Failed to load tasks: " + error.message);
  });
}

// Auth State Observer
auth.onAuthStateChanged(user => {
  const authSection = document.getElementById("auth");
  const todoSection = document.getElementById("todo");
  const userEmail = document.getElementById("user-email");
  const verifyWarning = document.getElementById("verify-warning");
  const logoutBtn = document.getElementById("logoutBtn");

    if (user) {
    authSection.style.display = "none";
    todoSection.style.display = "block";
    userEmail.textContent = "Logged in as: " + user.email;
    verifyWarning.style.display = user.emailVerified ? "none" : "block";
    logoutBtn.style.display = "inline-block"; // ✅ show logout
    startTaskListener(user.uid);
  } else {
    authSection.style.display = "block";
    todoSection.style.display = "none";
    userEmail.textContent = "";
    logoutBtn.style.display = "none"; // ✅ hide logout
    if (unsubscribeTasks) unsubscribeTasks();
  }

});
