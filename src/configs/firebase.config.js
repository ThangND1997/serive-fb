// Import the functions you need from the SDKs you need
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore'
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

import * as dotEnv from "dotenv";
dotEnv.config();

const firebaseConfig = { 
  apiKey : process.env.FIREBASE_KEY, 
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