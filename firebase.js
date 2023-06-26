// For Firebase JS SDK v7.20.0 and later, measurementId is optional
import { initializeApp } from 'firebase/app';
import { getAuth, onAuthStateChanged, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { doc, setDoc, getDoc, addDoc, deleteDoc, collection, serverTimestamp, query, where, getDocs } from "firebase/firestore";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyA5RomMVnANW64RQ04EO0eciJ9jDIkLMaA",
  authDomain: "instagram-f6ef5.firebaseapp.com",
  projectId: "instagram-f6ef5",
  storageBucket: "instagram-f6ef5.appspot.com",
  messagingSenderId: "431860204975",
  appId: "1:431860204975:web:2a39bab934d900a0965b5a",
  measurementId: "G-EM142KM8ZX"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const firestore = getFirestore()




export { app, auth, signOut, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, firestore, doc, setDoc, deleteDoc, getDoc, addDoc, collection, serverTimestamp, getDocs,  query, where, getAuth };
export default app;
