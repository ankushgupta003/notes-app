// src/components/NoteForm.jsx
import { useState } from "react";

function NoteForm({ addNote }) {
  const [text, setText] = useState("");
  const [image, setImage] = useState(null);

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

    addNote(text, image);
    setText("");
    setImage(null);
  };

  return (
    <form onSubmit={submit} className="mb-4">
      <textarea
        className="form-control mb-2"
        placeholder="Write your note..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={2}
      />

      <input
        type="file"
        accept="image/*"
        className="form-control mb-2"
        onChange={handleImage}
      />

      <button className="btn btn-primary w-100">Add Note</button>
    </form>
  );
}

export default NoteForm;
