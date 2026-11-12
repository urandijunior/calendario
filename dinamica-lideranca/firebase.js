// firebase.js — ponto único de importação do Firebase (facilita testes com um Firestore simulado)
export { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-app.js";
export { getAuth, signInAnonymously, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-auth.js";
export {
  getFirestore, doc, getDoc, setDoc, updateDoc, onSnapshot, collection, query, where,
  writeBatch, runTransaction, serverTimestamp, getDocs, increment, deleteDoc,
} from "https://www.gstatic.com/firebasejs/10.13.0/firebase-firestore.js";
