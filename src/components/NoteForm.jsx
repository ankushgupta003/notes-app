// src/components/NoteForm.jsx
import { useState } from "react";
import { TAGS } from "../constants/tags";

function NoteForm({ addNote }) {
  const [text, setText] = useState("");
  const [image, setImage] = useState(null);
  const [tag, setTag] = useState("work");

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => setImage(reader.result);
    reader.readAsDataURL(file);
  };

  const submit = (e) => {
    e.preventDefault();
    if (!text.trim() && !image) return;

    addNote(text, image, tag);
    setText("");
    setImage(null);
    setTag("work");
    // reset file input - trick: set value via DOM if needed; leaving simple here
  };

  return (
    <form onSubmit={submit} className="mb-4">
      <div className="mb-2">
        <textarea
          className="form-control"
          placeholder="Write your note..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={2}
        />
      </div>

      <div className="d-flex gap-2 mb-2 align-items-center">
        <select
          className="form-select"
          value={tag}
          onChange={(e) => setTag(e.target.value)}
          style={{ maxWidth: 180 }}
        >
          {/* Exclude "all" option from select */}
          {TAGS.filter((t) => t.id !== "all").map((t) => (
            <option key={t.id} value={t.id}>
              {t.label}
            </option>
          ))}
        </select>

        <input
          type="file"
          accept="image/*"
          className="form-control"
          style={{ maxWidth: 220 }}
          onChange={handleImage}
        />

        <button
          className="btn btn-primary"
          type="submit"
          style={{ minWidth: 120 }}
        >
          Add Note
        </button>
      </div>

      {image && (
        <div className="mb-2">
          <img
            src={image}
            alt="preview"
            className="img-fluid rounded"
            style={{ maxHeight: 160 }}
          />
        </div>
      )}
    </form>
  );
}

export default NoteForm;
