// src/components/NoteItem.jsx
import { useState } from "react";

/**
 * Simple helper to highlight search matches.
 * It returns an object { __html: ... } safe enough for small controlled content.
 * Be careful: never pass raw user HTML here in general apps.
 */
function getHighlightedHtml(text, query) {
  if (!query) return { __html: text };
  const q = query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); // escape regex
  const re = new RegExp(`(${q})`, "ig");
  const escaped = String(text).replace(/</g, "&lt;").replace(/>/g, "&gt;");
  const html = escaped.replace(re, '<mark class="px-1 rounded">$1</mark>');
  return { __html: html };
}

function NoteItem({ note, deleteNote, togglePin, editNote, highlight }) {
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState(note.text);

  const saveEdit = () => {
    editNote(note.id, value);
    setIsEditing(false);
  };

  return (
    <div className="p-3 bg-white note-card position-relative">
      {/* Pin Button */}
      <button
        className={`btn btn-sm ${
          note.pinned ? "btn-warning" : "btn-outline-secondary"
        } position-absolute`}
        style={{ top: "10px", right: "10px" }}
        onClick={() => togglePin(note.id)}
        title={note.pinned ? "Unpin" : "Pin"}
      >
        {note.pinned ? "📌" : "📍"}
      </button>

      {/* Image */}
      {note.image && (
        <img
          src={note.image}
          alt="note-img"
          className="img-fluid rounded mb-2"
        />
      )}

      {/* Edit Mode */}
      {isEditing ? (
        <>
          <textarea
            className="form-control mb-2"
            rows="3"
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />
          <div>
            <button className="btn btn-success btn-sm me-2" onClick={saveEdit}>
              Save
            </button>
            <button
              className="btn btn-secondary btn-sm"
              onClick={() => {
                setIsEditing(false);
                setValue(note.text);
              }}
            >
              Cancel
            </button>
          </div>
        </>
      ) : (
        <>
          <p
            className="mb-2"
            dangerouslySetInnerHTML={getHighlightedHtml(
              note.text || "",
              highlight
            )}
          />

          <div className="d-flex gap-2">
            <button
              className="btn btn-sm btn-primary"
              onClick={() => setIsEditing(true)}
            >
              Edit
            </button>

            <button
              className="btn btn-sm btn-danger"
              onClick={() => deleteNote(note.id)}
            >
              Delete
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default NoteItem;
