// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getFirestore} from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: "ai-flashcards-15574.firebaseapp.com",
  projectId: "ai-flashcards-15574",
  storageBucket: "ai-flashcards-15574.appspot.com",
  messagingSenderId: "50430365827",
  appId: "1:50430365827:web:9847400d2794f2879b4bb6"
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
const db = getFirestore(app);

export {db};