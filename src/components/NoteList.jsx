// src/components/NoteList.jsx
import NoteItem from "./NoteItem";

function NoteList({
  notes,
  rawNotes,
  deleteNote,
  togglePin,
  editNote,
  highlight,
}) {
  if (!rawNotes || rawNotes.length === 0)
    return <p className="text-center text-muted mt-4">No notes yet...</p>;

  // pinned ordering should be based on full list (so pins persist even when searching)
  // we'll get pinned ids from rawNotes
  const pinnedIds = new Set(rawNotes.filter((n) => n.pinned).map((n) => n.id));

  // sort incoming notes so pinned ones appear first (if they are present in the filtered list)
  const sorted = [...notes].sort((a, b) => {
    const pa = pinnedIds.has(a.id) ? 1 : 0;
    const pb = pinnedIds.has(b.id) ? 1 : 0;
    if (pa === pb) return b.id - a.id; // newest first
    return pa - pb ? -1 : 1; // pinned first
  });

  if (sorted.length === 0)
    return <p className="text-center text-muted mt-4">No matching notes...</p>;

  return (
    <div className="row">
      {sorted.map((note) => (
        <div key={note.id} className="col-md-4 mb-3">
          <NoteItem
            note={note}
            deleteNote={deleteNote}
            togglePin={togglePin}
            editNote={editNote}
            highlight={highlight}
          />
        </div>
      ))}
    </div>
  );
}

export default NoteList;
