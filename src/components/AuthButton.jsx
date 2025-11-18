// src/components/AuthButton.jsx
import React, { useEffect, useState } from "react";
import {
  auth,
  onAuthStateChanged,
  signInWithGoogle,
  signOutUser,
} from "../firebase";

export default function AuthButton() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const offAuth = onAuthStateChanged(auth, (u) => setUser(u));
    return () => offAuth();
  }, []);

  if (!user) {
    return (
      <button
        className="btn btn-outline-primary"
        onClick={() => signInWithGoogle()}
      >
        Sign in with Google
      </button>
    );
  }

  return (
    <div className="d-flex align-items-center gap-2">
      <img
        src={user.photoURL}
        alt={user.displayName}
        referrerPolicy="no-referrer"
        style={{ width: 32, height: 32, borderRadius: 999 }}
      />
      <span style={{ fontSize: 14 }}>{user.displayName}</span>
      <button
        className="btn btn-outline-secondary"
        onClick={() => signOutUser()}
      >
        Sign out
      </button>
    </div>
  );
}
