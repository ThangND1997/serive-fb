// Import the functions you need from the SDKs you need
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore'
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

// const firebaseConfig = {
//   apiKey: "AIzaSyDFKvDZ_bePgsor3SOZBUvOVI3Z8wqsgYQ",
//   databaseURL: "https://chatbox-firebase-d0c5d-default-rtdb.firebaseio.com",
//   authDomain: "chatbox-firebase-d0c5d.firebaseapp.com",
//   projectId: "chatbox-firebase-d0c5d",
//   storageBucket: "chatbox-firebase-d0c5d.appspot.com",
//   messagingSenderId: "575706021600",
//   appId: "1:575706021600:web:e0e7fa9100b3db4d7b9a85",
//   measurementId: "G-GXX1W2NWN3"
// };
const firebaseConfig = { 
  apiKey : "AIzaSyDfvqKjhZQLJfBQQqkhQU30FW4rPWudLd8" , 
  databaseURL: "https://fbservice-e0023-default-rtdb.firebaseio.com",
  authDomain : "fbservice-e0023.firebaseapp.com" , 
  projectId : "fbservice-e0023" , 
  storageBucket : "fbservice-e0023.appspot.com" , 
  messagingSenderId : "515620572171" , 
  appId : "1:515620572171:web:4dda61040eb2cea23c4b0e" , 
  measurementId : "G-N42XQ9YLMK" 
};

const firebaseApp = firebase.initializeApp(firebaseConfig);

// Use these for db & auth
const db = firebaseApp.firestore();
const auth = firebase.auth();

export { auth, db };
export default firebase