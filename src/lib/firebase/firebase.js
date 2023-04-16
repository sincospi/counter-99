// Firebase App (the core Firebase SDK) is always required
import { initializeApp } from "firebase/app";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD3LcfuBcOYsn3wyQIMKKkoIYLD5oeK-JI",
  authDomain: "counter-99.firebaseapp.com",
  projectId: "counter-99",
  storageBucket: "counter-99.appspot.com",
  messagingSenderId: "415144950645",
  appId: "1:415144950645:web:bb26147a8fe1beee49f13c",
};

export const firebaseApp = initializeApp(firebaseConfig);
console.log("Fireabase initialized!");
