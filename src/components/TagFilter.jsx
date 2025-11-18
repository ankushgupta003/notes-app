// src/components/TagFilter.jsx
import React from "react";

/**
 * tags: array of {id,label,color}
 * activeTag: string
 * setActiveTag: fn
 */
function TagFilter({ tags, activeTag, setActiveTag }) {
  return (
    <div className="d-flex flex-wrap gap-2">
      {tags.map((t) => (
        <button
          key={t.id}
          className={`btn btn-sm ${
            activeTag === t.id ? "active" : "btn-outline-secondary"
          }`}
          style={{
            borderRadius: 20,
            background: activeTag === t.id ? t.color : undefined,
            color: activeTag === t.id ? "white" : undefined,
            border: activeTag === t.id ? "none" : undefined,
            minWidth: 92,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
            padding: "6px 10px",
          }}
          onClick={() => setActiveTag(t.id)}
        >
          {/* small color dot */}
          {t.id !== "all" && (
            <span
              style={{
                width: 10,
                height: 10,
                borderRadius: "50%",
                background: t.color,
                display: "inline-block",
                boxShadow: "0 0 0 2px rgba(255,255,255,0.12) inset",
              }}
            />
          )}
          <span style={{ fontSize: 13 }}>{t.label}</span>
        </button>
      ))}
    </div>
  );
}

export default TagFilter;
