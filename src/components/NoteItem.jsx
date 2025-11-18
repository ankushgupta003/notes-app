import { useState } from "react";
import { TAGS } from "../constants/tags";
import { jsPDF } from "jspdf"; // <-- ADD THIS

function getHighlightedHtml(text, query) {
  if (!query) return { __html: text };
  const q = query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const re = new RegExp(`(${q})`, "ig");
  const escaped = String(text).replace(/</g, "&lt;").replace(/>/g, "&gt;");
  const html = escaped.replace(re, '<mark class="px-1 rounded">$1</mark>');
  return { __html: html };
}

function NoteItem({ note, deleteNote, togglePin, editNote, highlight }) {
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState(note.text);
  const [tag, setTag] = useState(note.tag || "work");

  const saveEdit = () => {
    editNote(note.id, value, tag);
    setIsEditing(false);
  };

  const tagObj = TAGS.find((t) => t.id === note.tag) || TAGS[1];

  // ------------------------------------
  // 🚀 PDF Export Function
  // ------------------------------------
  const exportSingleNote = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("Note", 10, 20);

    // text
    doc.setFontSize(12);
    doc.text(note.text || "", 10, 40);

    // tag
    if (note.tag) {
      doc.setFontSize(12);
      doc.text(`Tag: ${tagObj.label}`, 10, 60);
    }

    // image (optional)
    if (note.image) {
      try {
        doc.addImage(note.image, "JPEG", 10, 80, 80, 80);
      } catch (e) {
        console.warn("Image couldn't be added to PDF:", e);
      }
    }

    doc.save(`note-${note.id}.pdf`);
  };
  // ------------------------------------

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

      {/* Tag badge */}
      <div className="mb-2 d-flex align-items-center gap-2">
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            padding: "6px 8px",
            borderRadius: 14,
            background: tagObj.color,
            color: "white",
            fontSize: 13,
            fontWeight: 600,
            boxShadow: "0 1px 0 rgba(0,0,0,0.06)",
          }}
        >
          <span
            style={{
              width: 10,
              height: 10,
              borderRadius: "50%",
              background: "rgba(255,255,255,0.3)",
            }}
          />
          {tagObj.label}
        </span>
      </div>

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

          <div className="d-flex gap-2 mb-2 align-items-center">
            <select
              className="form-select"
              style={{ maxWidth: 160 }}
              value={tag}
              onChange={(e) => setTag(e.target.value)}
            >
              {TAGS.filter((t) => t.id !== "all").map((t) => (
                <option value={t.id} key={t.id}>
                  {t.label}
                </option>
              ))}
            </select>

            <button className="btn btn-success btn-sm" onClick={saveEdit}>
              Save
            </button>
            <button
              className="btn btn-secondary btn-sm"
              onClick={() => {
                setIsEditing(false);
                setValue(note.text);
                setTag(note.tag);
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
            {/* NEW PDF BUTTON */}
            <button className="btn btn-sm btn-dark" onClick={exportSingleNote}>
              PDF
            </button>

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
