// src/App.jsx
import { useState, useEffect, useMemo } from "react";
import NoteForm from "./components/NoteForm";
import NoteList from "./components/NoteList";
import ThemeToggle from "./components/ThemeToggle";
import TagFilter from "./components/TagFilter";
import { TAGS } from "./constants/tags";

function App() {
  const [notes, setNotes] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTag, setActiveTag] = useState("all");

  // Load from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("notes");
    if (saved) setNotes(JSON.parse(saved));
  }, []);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem("notes", JSON.stringify(notes));
  }, [notes]);

  const addNote = (text, image = null, tag = "work") => {
    const newNote = {
      id: Date.now(),
      text,
      image,
      tag,
      pinned: false,
    };
    // newest first
    setNotes((s) => [newNote, ...s]);
  };

  const deleteNote = (id) => setNotes((s) => s.filter((n) => n.id !== id));

  const togglePin = (id) =>
    setNotes((s) =>
      s.map((n) => (n.id === id ? { ...n, pinned: !n.pinned } : n))
    );

  const editNote = (id, newText, newTag = null) =>
    setNotes((s) =>
      s.map((n) =>
        n.id === id
          ? { ...n, text: newText, ...(newTag ? { tag: newTag } : {}) }
          : n
      )
    );

  // Combined filtering by tag + search term
  const filteredNotes = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    return notes.filter((n) => {
      if (activeTag !== "all" && n.tag !== activeTag) return false;
      if (!q) return true;
      return (n.text || "").toLowerCase().includes(q);
    });
  }, [notes, searchTerm, activeTag]);

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
        notes={filteredNotes}
        rawNotes={notes}
        deleteNote={deleteNote}
        togglePin={togglePin}
        editNote={editNote}
        highlight={searchTerm.trim()}
      />
    </div>
  );
}

export default App;
