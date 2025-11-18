// src/firebase.js
import { initializeApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import {
  getDatabase,
  ref,
  push,
  set,
  update,
  remove,
  onValue,
  off,
} from "firebase/database";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const db = getDatabase(app);

/* Auth helpers */
export const signInWithGoogle = () => signInWithPopup(auth, provider);
export const signOutUser = () => signOut(auth);
export { onAuthStateChanged, auth, db };

/* DB helpers for per-user notes under /notes/{uid}/{noteId} */

/**
 * startListeningToUserNotes(userUid, callback)
 *   callback receives an object of notes { id: {id, text, image, tag, pinned, updatedAt} }
 * Returns a function to stop listening.
 */
export function startListeningToUserNotes(userUid, callback) {
  if (!userUid) return () => {};
  const notesRef = ref(db, `notes/${userUid}`);
  const listener = (snap) => {
    const data = snap.val() || {};
    callback(data);
  };
  onValue(notesRef, listener);
  // return cleanup
  return () => off(notesRef, "value", listener);
}

/* create note */
export async function createNoteForUser(userUid, note) {
  // note: { text, image, tag, pinned }
  const notesRef = ref(db, `notes/${userUid}`);
  const newRef = push(notesRef);
  const payload = {
    ...note,
    updatedAt: Date.now(),
    id: newRef.key,
  };
  await set(newRef, payload);
  return payload;
}

/* update note */
export async function updateNoteForUser(userUid, noteId, partial) {
  const noteRef = ref(db, `notes/${userUid}/${noteId}`);
  const toUpdate = { ...partial, updatedAt: Date.now() };
  await update(noteRef, toUpdate);
}

/* delete note */
export async function deleteNoteForUser(userUid, noteId) {
  const noteRef = ref(db, `notes/${userUid}/${noteId}`);
  await remove(noteRef);
}
