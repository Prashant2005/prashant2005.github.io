// Initialize Firebase
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  databaseURL: "YOUR_DATABASE_URL",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};

firebase.initializeApp(firebaseConfig);
const database = firebase.database();
const auth = firebase.auth();

let currentUser = null;

// Function to send a message
function sendMessage() {
  const message = document.getElementById('message-input').value;
  const senderDisplayName = currentUser.displayName || 'Guest';
  if (message.trim() !== '') {
    database.ref(`private-messages/admin`).push().set({
      text: message,
      timestamp: firebase.database.ServerValue.TIMESTAMP,
      senderDisplayName: senderDisplayName
    });
    document.getElementById('message-input').value = '';
  }
}

// Function to display messages
function displayMessages() {
  const chatBox = document.getElementById('chat-box');
  chatBox.innerHTML = '';

  database.ref(`private-messages/admin`).on('child_added', snapshot => {
    const message = snapshot.val();
    const messageElement = document.createElement('div');
    messageElement.innerText = `${message.senderDisplayName}: ${message.text}`;
    chatBox.appendChild(messageElement);
  });
}

// Function to sign in
function signIn() {
  const provider = new firebase.auth.GoogleAuthProvider();
  auth.signInWithPopup(provider).then(result => {
    currentUser = result.user;
    document.getElementById('sign-in-button').style.display = 'none';
    document.getElementById('sign-out-button').style.display = 'inline-block';
    document.getElementById('chat-box').style.display = 'block';
    displayMessages();
  });
}

// Function to sign out
function signOut() {
  auth.signOut().then(() => {
    currentUser = null;
    document.getElementById('sign-in-button').style.display = 'inline-block';
    document.getElementById('sign-out-button').style.display = 'none';
    document.getElementById('chat-box').style.display = 'none';
  });
}

// Authentication state change listener
auth.onAuthStateChanged(user => {
  if (user) {
    currentUser = user;
    document.getElementById('sign-in-button').style.display = 'none';
    document.getElementById('sign-out-button').style.display = 'inline-block';
    document.getElementById('chat-box').style.display = 'block';
    displayMessages();
  } else {
    currentUser = null;
    document.getElementById('sign-in-button').style.display = 'inline-block';
    document.getElementById('sign-out-button').style.display = 'none';
    document.getElementById('chat-box').style.display = 'none';
  }
});
