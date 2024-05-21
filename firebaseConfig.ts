// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getAuth} from 'firebase/auth'
import {getFirestore} from 'firebase/firestore'

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAVVwqZwC57Gx4h_icEjc87TZPFW0p6ruw",
  authDomain: "transporchat.firebaseapp.com",
  projectId: "transporchat",
  storageBucket: "transporchat.appspot.com",
  messagingSenderId: "332039509343",
  appId: "1:332039509343:web:267cce13a04d17ed96d2ea",
  measurementId: "G-JW5V4667QF"
};

// Initialize Firebase
export const FIREBASE_APP = initializeApp(firebaseConfig);
export const FIREBASE_AUTH = getAuth(FIREBASE_APP)
export const FIRESTORE_DB = getFirestore(FIREBASE_APP)
