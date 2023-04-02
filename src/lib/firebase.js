// Firebase App (the core Firebase SDK) is always required
import { initializeApp } from 'firebase/app';
import {
  getFirestore,
  onSnapshot,
  doc,
  updateDoc,
  arrayUnion,
} from 'firebase/firestore';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyD3LcfuBcOYsn3wyQIMKKkoIYLD5oeK-JI',
  authDomain: 'counter-99.firebaseapp.com',
  projectId: 'counter-99',
  storageBucket: 'counter-99.appspot.com',
  messagingSenderId: '415144950645',
  appId: '1:415144950645:web:bb26147a8fe1beee49f13c',
};

// Initialize Firebase
initializeApp(firebaseConfig);

const db = getFirestore();

export const initialSessionData = {
  players: [],
  createdAt: null,
  awards: [],
  playerScores: {},
};

export function subscribeSessionData(sessionId, refreshSessionData) {
  console.log(`SUBSCRIBE to docSnap ${sessionId}`);
  const docSnapUnsubscribe = onSnapshot(
    doc(db, 'sessions', sessionId),
    (docSnap) => {
      if (docSnap.exists()) {
        console.log(`RECEIVED for docSnap ${sessionId}`);
        refreshSessionData(docSnap.data());
      } else {
        console.error(`Document ${sessionId} not found`);
      }
    }
  );
  return docSnapUnsubscribe;
}

export async function appendToPlayerScore(sessionId, player, value) {
  console.log(
    `Appending ${value} to player ${player} for session ${sessionId}`
  );
  const docRef = doc(db, 'sessions', sessionId);
  return updateDoc(docRef, {
    awards: arrayUnion({
      created_at: new Date(),
      player,
      value,
    }),
  });
}
