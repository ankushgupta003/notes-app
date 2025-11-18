// src/App.jsx
import React, { useEffect, useState, useCallback } from "react";
import { Button } from "bootstrap";
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

import logoSrc from "./assets/logo.png";

function App() {
  const [user, setUser] = useState(null);
  const [notesObj, setNotesObj] = useState({});
  const [notesList, setNotesList] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTag, setActiveTag] = useState("all");

  // ------------------------------------------------------------------
  // AUTH STATE
  // ------------------------------------------------------------------
  useEffect(() => {
    const off = onAuthStateChanged(auth, (u) => setUser(u));
    return () => off();
  }, []);

  // ------------------------------------------------------------------
  // REALTIME NOTES
  // ------------------------------------------------------------------
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

  // convert notesObj to sorted array
  useEffect(() => {
    const arr = Object.values(notesObj || {}).sort((a, b) => {
      if ((a.pinned ? 1 : 0) !== (b.pinned ? 1 : 0))
        return (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0);
      return b.updatedAt - a.updatedAt;
    });
    setNotesList(arr);
  }, [notesObj]);

  // ACTIONS
  const addNote = useCallback(
    async (text, image = null, tag = "work") => {
      if (!user) return alert("Please sign in.");
      await createNoteForUser(user.uid, { text, image, tag, pinned: false });
    },
    [user]
  );

  const deleteNote = useCallback(
    async (id) => {
      if (!user) return alert("Please sign in.");
      await deleteNoteForUser(user.uid, id);
    },
    [user]
  );

  const togglePin = useCallback(
    async (id) => {
      if (!user) return alert("Please sign in.");
      const existing = notesObj[id];
      if (!existing) return;
      await updateNoteForUser(user.uid, id, { pinned: !existing.pinned });
    },
    [user, notesObj]
  );

  const editNote = useCallback(
    async (id, newText, newTag = null) => {
      if (!user) return alert("Please sign in.");
      await updateNoteForUser(user.uid, id, {
        text: newText,
        ...(newTag ? { tag: newTag } : {}),
      });
    },
    [user]
  );

  // FILTER
  const filtered = notesList.filter((n) => {
    if (activeTag !== "all" && n.tag !== activeTag) return false;
    if (!searchTerm) return true;
    return n.text?.toLowerCase().includes(searchTerm.toLowerCase());
  });

  // ------------------------------------------------------------------
  // UI
  // ------------------------------------------------------------------
  return (
    <div className="container py-3">
      {/* -------------------------------------------------------------- */}
      {/* HEADER */}
      {/* -------------------------------------------------------------- */}
      <header className="d-flex align-items-center justify-content-between mb-3">
        {/* Left section → Logo + Title */}
        <div className="d-flex align-items-center gap-2">
          <img
            src={logoSrc}
            alt="logo"
            className="me-2"
            style={{ height: 42 }}
            onError={(e) => (e.target.style.display = "none")}
          />

          <div className="d-none d-sm-block">
            <h2 className="mb-0 fw-bold">Smart Notes</h2>
            <div className="text-muted small">Clean • Fast • Private</div>
          </div>
        </div>

        {/* Right section → Desktop toggles */}
        <div className="d-none d-md-flex align-items-center gap-3">
          <ThemeToggle />
          <AuthButton />
        </div>

        {/* Mobile Hamburger Button */}
        <button
          className="btn btn-outline-secondary d-md-none"
          data-bs-toggle="offcanvas"
          data-bs-target="#mobileMenu"
        >
          <i className="bi bi-list fs-3"></i>
        </button>
      </header>

      {/* -------------------------------------------------------------- */}
      {/* OFFCANVAS MENU (MOBILE) */}
      {/* -------------------------------------------------------------- */}
      <div className="offcanvas offcanvas-end" tabIndex="-1" id="mobileMenu">
        <div className="offcanvas-header">
          <h5 className="offcanvas-title">Menu</h5>
          <button
            type="button"
            className="btn-close"
            data-bs-dismiss="offcanvas"
          ></button>
        </div>

        <div className="offcanvas-body d-flex flex-column gap-4">
          <div>
            <ThemeToggle />
          </div>
          <div>
            <AuthButton />
          </div>

          <hr />

          <p className="text-muted small">Filters</p>
          <TagFilter
            tags={TAGS}
            activeTag={activeTag}
            setActiveTag={setActiveTag}
          />
        </div>
      </div>

      {/* -------------------------------------------------------------- */}
      {/* SEARCH BAR */}
      {/* -------------------------------------------------------------- */}
      <div className="mb-3">
        <input
          type="search"
          className="form-control form-control-lg"
          placeholder="Search notes..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* -------------------------------------------------------------- */}
      {/* NOTE FORM */}
      {/* -------------------------------------------------------------- */}
      <div className="mb-3">
        <NoteForm addNote={addNote} />
      </div>

      {/* Desktop Tag Filter */}
      <div className="d-none d-md-block mb-3">
        <TagFilter
          tags={TAGS}
          activeTag={activeTag}
          setActiveTag={setActiveTag}
        />
      </div>

      {/* -------------------------------------------------------------- */}
      {/* NOTES LIST */}
      {/* -------------------------------------------------------------- */}
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
