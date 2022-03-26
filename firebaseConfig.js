// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA-Ir787mlVbK-OZolOcCURLyD7JckkwrQ",
  authDomain: "archive-ba3a4.firebaseapp.com",
  projectId: "archive-ba3a4",
  storageBucket: "archive-ba3a4.appspot.com",
  messagingSenderId: "481912305460",
  appId: "1:481912305460:web:ad2efb37940479f50e1761"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);