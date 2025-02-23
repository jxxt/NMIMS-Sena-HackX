// src/config/firebase.js
import { initializeApp } from "firebase/app";
import {
    getAuth,
    sendSignInLinkToEmail,
    isSignInWithEmailLink,
    signInWithEmailLink,
} from "firebase/auth";
import { getDatabase, ref, get, set, push } from "firebase/database"; // Added push here

const firebaseConfig = {
    apiKey: "AIzaSyBr9QcMb2DyLIeKxgTVJC9BFUOWo9ZzmdI",
    authDomain: "event-verse-app.firebaseapp.com",
    databaseURL:
        "https://event-verse-app-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "event-verse-app",
    storageBucket: "event-verse-app.firebasestorage.app",
    messagingSenderId: "419801349504",
    appId: "1:419801349504:web:24bdf53ea91e9959bc5565",
};

// Initialize Firebase App
const app = initializeApp(firebaseConfig);

// Initialize Auth and Database
const auth = getAuth(app);
const db = getDatabase(app);

export {
    auth,
    sendSignInLinkToEmail,
    isSignInWithEmailLink,
    signInWithEmailLink,
    db,
    ref,
    get,
    set,
    push, // Added push to exports
};
