// src/App.jsx
import React, { useEffect, useState, useCallback } from "react";
import NoteForm from "./components/NoteForm";
import NoteList from "./components/NoteList";
import ThemeToggle from "./components/ThemeToggle";
import TagFilter from "./components/TagFilter";
import AuthButton from "./components/AuthButton";
import { TAGS } from "./constants/tags";

import {
  auth,
  onAuthStateChanged,
  startListeningToUserNotes,
  createNoteForUser,
  updateNoteForUser,
  deleteNoteForUser,
} from "./firebase";

function App() {
  const [user, setUser] = useState(null);
  const [notesObj, setNotesObj] = useState({}); // object keyed by id
  const [notesList, setNotesList] = useState([]); // array form for UI
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTag, setActiveTag] = useState("all");

  // Auth listener
  useEffect(() => {
    const off = onAuthStateChanged(auth, (u) => setUser(u));
    return () => off();
  }, []);

  // Listen to user notes when user signs in
  useEffect(() => {
    if (!user) {
      setNotesObj({});
      setNotesList([]);
      return;
    }
    const stop = startListeningToUserNotes(user.uid, (obj) => {
      setNotesObj(obj || {});
    });
    return () => stop();
  }, [user]);

  // convert notesObj to sorted array (pinned first, then newest)
  useEffect(() => {
    const arr = Object.values(notesObj || {}).sort((a, b) => {
      if ((a.pinned ? 1 : 0) !== (b.pinned ? 1 : 0))
        return (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0);
      return b.updatedAt - a.updatedAt;
    });
    setNotesList(arr);
  }, [notesObj]);

  const addNote = useCallback(
    async (text, image = null, tag = "work") => {
      if (!user) {
        alert("Please sign in to save notes to the cloud.");
        return;
      }
      await createNoteForUser(user.uid, { text, image, tag, pinned: false });
      // realtime listener will update state
    },
    [user]
  );

  const deleteNote = useCallback(
    async (id) => {
      if (!user) {
        alert("Please sign in.");
        return;
      }
      await deleteNoteForUser(user.uid, id);
    },
    [user]
  );

  const togglePin = useCallback(
    async (id) => {
      if (!user) {
        alert("Please sign in.");
        return;
      }
      const existing = notesObj[id];
      if (!existing) return;
      await updateNoteForUser(user.uid, id, { pinned: !existing.pinned });
    },
    [user, notesObj]
  );

  const editNote = useCallback(
    async (id, newText, newTag = null) => {
      if (!user) {
        alert("Please sign in.");
        return;
      }
      await updateNoteForUser(user.uid, id, {
        text: newText,
        ...(newTag ? { tag: newTag } : {}),
      });
    },
    [user]
  );

  // Filter notes by tag and search
  const filtered = notesList.filter((n) => {
    if (activeTag !== "all" && n.tag !== activeTag) return false;
    if (!searchTerm) return true;
    return (n.text || "").toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <div className="container py-5">
      <div className="d-flex align-items-center justify-content-between mb-4">
        <h1 className="app-title mb-0">📝 Smart Notes</h1>

        <div className="d-flex align-items-center gap-2">
          <input
            type="search"
            className="form-control me-2"
            placeholder="Search notes..."
            style={{ minWidth: 220 }}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <ThemeToggle />
          <AuthButton />
        </div>
      </div>

      <NoteForm addNote={addNote} />

      <div className="mb-3">
        <TagFilter
          tags={TAGS}
          activeTag={activeTag}
          setActiveTag={setActiveTag}
        />
      </div>

      <NoteList
        notes={filtered}
        rawNotes={notesList}
        deleteNote={deleteNote}
        togglePin={togglePin}
        editNote={editNote}
        highlight={searchTerm.trim()}
      />
    </div>
  );
}

export default App;
