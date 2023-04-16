import {
  getFirestore,
  onSnapshot,
  doc,
  updateDoc,
  arrayUnion,
  arrayRemove,
  query,
  collection,
  orderBy,
  addDoc,
} from 'firebase/firestore';

import { firebaseApp } from "./firebase";
import { auth } from "./auth";


const db = getFirestore(firebaseApp);

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

export function subscribeSessionsList(refreshSessionsList) {
  const q = query(collection(db, 'sessions'), orderBy('created_at', 'desc'));
  const listSnapUnsubscribe = onSnapshot(q, (snaps) => {
    console.log(`RECEIVED snap list`);
    const list = [];
    snaps.forEach((doc) => {
      list.push({ ...doc.data(), id: doc.id });
      console.log('adding item to list');
    });
    refreshSessionsList(list);
  });
  return listSnapUnsubscribe;
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

export async function removeFromPlayerScore(sessionId, player, createdAt) {
  console.log(
    `Deleting ${createdAt} from ${player} for session ${sessionId}`
  );
  const valueToRemove = { created_at: createdAt, player, value: 1 };
  const docRef = doc(db, 'sessions', sessionId);
  return updateDoc(docRef, {
    awards: arrayRemove(valueToRemove),
  });
}

export async function resetAllPlayerScores(sessionId) {
  console.log(
    `Reseting all player scores for session ${sessionId}`
  );
  const docRef = doc(db, 'sessions', sessionId);
  return updateDoc(docRef, {
    awards: [],
  });
}


export async function createNewSession(playerNamesArr) {
  const db = getFirestore();
  let docRef;
  const newSession = {
    created_at: new Date(),
    created_by: {uuid: auth.currentUser.uid, name: auth.currentUser.displayName},
    players: playerNamesArr,
    awards: [],
  }
  console.log({ createPayload: newSession })
  try {
    docRef = await addDoc(collection(db, 'sessions'), newSession);
    console.log('Session document added with ID: ', docRef.id);
    return docRef.id;
  } catch (e) {
    console.error('Error adding session document: ', e);
    return null;
  }
}