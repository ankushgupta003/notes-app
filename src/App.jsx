// src/App.jsx
import { useState, useEffect, useMemo } from "react";
import NoteForm from "./components/NoteForm";
import NoteList from "./components/NoteList";
import ThemeToggle from "./components/ThemeToggle";

function App() {
  const [notes, setNotes] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  // Load from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("notes");
    if (saved) setNotes(JSON.parse(saved));
  }, []);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem("notes", JSON.stringify(notes));
  }, [notes]);

  // Debounce search input (300ms)
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(searchTerm.trim()), 300);
    return () => clearTimeout(t);
  }, [searchTerm]);

  const addNote = (text, image = null) => {
    setNotes([
      ...notes,
      {
        id: Date.now(),
        text,
        image,
        pinned: false,
      },
    ]);
  };

  const deleteNote = (id) => setNotes(notes.filter((n) => n.id !== id));

  const togglePin = (id) =>
    setNotes(notes.map((n) => (n.id === id ? { ...n, pinned: !n.pinned } : n)));

  const editNote = (id, newText) =>
    setNotes(notes.map((n) => (n.id === id ? { ...n, text: newText } : n)));

  // Filter notes by debounced search term (case-insensitive)
  const filteredNotes = useMemo(() => {
    if (!debouncedSearch) return notes;
    const q = debouncedSearch.toLowerCase();
    return notes.filter((n) => {
      const txt = (n.text || "").toLowerCase();
      return txt.includes(q);
    });
  }, [notes, debouncedSearch]);

  return (
    <div className="container py-5">
      <div className="d-flex align-items-center justify-content-between mb-4">
        <h1 className="app-title mb-0">📝 Smart Notes</h1>

        <div className="d-flex align-items-center gap-2">
          {/* Search input */}
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
      <NoteList
        notes={filteredNotes}
        rawNotes={notes} // pass original list for pin-ordering if needed
        deleteNote={deleteNote}
        togglePin={togglePin}
        editNote={editNote}
        highlight={debouncedSearch}
      />
    </div>
  );
}

export default App;
