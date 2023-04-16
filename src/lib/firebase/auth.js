import {
  getAuth,
  onAuthStateChanged,
  EmailAuthProvider,
  signOut,
} from "firebase/auth";

import { firebaseApp } from "./firebase";

const auth = getAuth(firebaseApp);
export { auth, onAuthStateChanged, EmailAuthProvider, signOut };
