import React, { useState, useRef, useEffect } from "react";
import { supabase } from "./supabaseClient";
import "./MoodboardBuilder.css";

/**
 * PUBLIC_INTERFACE
 * MoodboardBuilder - Playful, drag & drop moodboard/inspiration collage builder.
 * Modern, modal overlay. Allows image/palette drops, move, resize, delete.
 * Saves collections to Supabase (dashboard).
 * 
 * @param {object} props
 * @param {boolean} props.open Show/hide modal overlay
 * @param {Function} props.onClose Callback for closing
 * @param {object} props.user User object {id: ...}
 * @param {Array} [props.paletteOptions] Palette swatches user can drag in (optional)
 * @param {Array} [props.imageOptions] Gallery images to drag in (optional)
 */
function MoodboardBuilder({
  open,
  onClose,
  user,
  paletteOptions = [],
  imageOptions = [],
  defaultBoard = null, // preload for edit/restore
}) {
  // Board objects: array of {id, type: 'image'|'palette', x, y, w, h, data:<url|palette>}
  const [objects, setObjects] = useState(defaultBoard?.objects || []);
  const [dragItem, setDragItem] = useState(null); // currently dragged {type:..,data:..}
  const [selectedId, setSelectedId] = useState(null);
  const [title, setTitle] = useState(defaultBoard?.title || "");
  const [saving, setSaving] = useState(false);
  const [saveNotice, setSaveNotice] = useState("");

  const boardRef = useRef();
  const initialPosRef = useRef({}); // used for drag/resize

  useEffect(() => {
    if (defaultBoard) {
      setObjects(defaultBoard.objects || []);
      setTitle(defaultBoard.title || "");
    } else {
      setObjects([]);
      setTitle("");
    }
  }, [defaultBoard, open]);

  // Add drag'n'dropped image/palette to board at mouse pos
  function handleDrop(ev) {
    ev.preventDefault();
    let type = ev.dataTransfer.getData("drag-type");
    const data = ev.dataTransfer.getData("data");
    if (!type || !data) return;
    const rect = boardRef.current.getBoundingClientRect();
    let x = ev.clientX - rect.left - 75; // default offset
    let y = ev.clientY - rect.top - 75;
    let id = `${type}_${Date.now()}_${Math.floor(Math.random() * 100000)}`;
    if (type === "image") {
      setObjects((objs) => [
        ...objs,
        {
          id,
          type: "image",
          x: Math.max(0, x),
          y: Math.max(0, y),
          w: 160,
          h: 120,
          data: data,
        },
      ]);
    }
    if (type === "palette") {
      // Palettes are array strings, accept as JSON
      setObjects((objs) => [
        ...objs,
        {
          id,
          type: "palette",
          x: Math.max(0, x),
          y: Math.max(0, y),
          w: 140,
          h: 85,
          data: data,
        },
      ]);
    }
    setSelectedId(id);
  }

  // Drag'n'drop handlers for toolbar
  function handleDragStart(ev, type, data) {
    ev.dataTransfer.setData("drag-type", type);
    ev.dataTransfer.setData("data", typeof data === "string" ? data : JSON.stringify(data));
    setDragItem({ type, data });
  }

  // Drag board objects (move/resize)
  function handleObjMouseDown(e, id, mode) {
    e.stopPropagation();
    setSelectedId(id);
    document.body.style.userSelect = "none";
    initialPosRef.current = {
      mouseX: e.clientX,
      mouseY: e.clientY,
      ...objects.find((o) => o.id === id),
      mode: mode || "move"
    };
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
  }
  function handleMouseMove(e) {
    setObjects((objs) => {
      const obj = objs.find((o) => o.id === selectedId);
      if (!obj) return objs;
      const idx = objs.indexOf(obj);
      const { mouseX, mouseY, x, y, w, h, mode } = initialPosRef.current;
      let dx = e.clientX - mouseX, dy = e.clientY - mouseY;
      let newObj = { ...obj };
      if (mode === "move") {
        newObj.x = Math.max(0, Math.min(x + dx, 750 - newObj.w));
        newObj.y = Math.max(0, Math.min(y + dy, 480 - newObj.h));
      }
      if (mode === "resize") {
        newObj.w = Math.max(40, Math.min(w + dx, 740 - newObj.x));
        newObj.h = Math.max(35, Math.min(h + dy, 470 - newObj.y));
      }
      let next = [...objs];
      next[idx] = newObj;
      return next;
    });
  }
  function handleMouseUp() {
    window.removeEventListener("mousemove", handleMouseMove);
    window.removeEventListener("mouseup", handleMouseUp);
    document.body.style.userSelect = "";
  }

  // Remove board object
  function handleDeleteObj(id, ev) {
    ev.stopPropagation();
    setObjects((objs) => objs.filter((o) => o.id !== id));
    if (selectedId === id) setSelectedId(null);
  }

  // Save moodboard to Supabase
  async function handleSaveBoard() {
    setSaving(true);
    setSaveNotice("");
    try {
      // Save objects/positions/title
      await supabase.from("saved_moodboards").insert([
        {
          user_id: user?.id || "demo-user",
          board_data: JSON.stringify({ objects }),
          title: title || "Untitled Moodboard",
          saved_at: new Date().toISOString(),
        }
      ]);
      setSaveNotice("Saved!");
      setTimeout(() => setSaveNotice(""), 1200);
      if (onClose) onClose();
    } catch (e) {
      setSaveNotice("Save failed");
      setTimeout(() => setSaveNotice(""), 1300);
    }
    setSaving(false);
  }

  // Empty state
  if (!open) return null;

  return (
    <div className="moodboard-modal-overlay">
      <div className="moodboard-modal-content">
        <button
          className="moodboard-close-btn"
          aria-label="Close Moodboard"
          onClick={onClose}
        >
          ✕
        </button>
        <h2 className="moodboard-title">✨ Your Moodboard</h2>
        <input
          className="moodboard-title-input"
          placeholder="Moodboard title..."
          value={title}
          onChange={e => setTitle(e.target.value.slice(0,32))}
          maxLength={32}
        />
        <div
          className="moodboard-board"
          ref={boardRef}
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          tabIndex={0}
        >
          {/* Render objects */}
          {objects.map((obj) => (
            <MoodboardObj
              key={obj.id}
              obj={obj}
              selected={selectedId === obj.id}
              onDelete={handleDeleteObj}
              onMouseDown={handleObjMouseDown}
            />
          ))}
        </div>
        <div className="moodboard-sidebar">
          <div className="moodboard-toolbar-row">
            <span className="toolbar-label">Images</span>
            <div className="toolbar-scroller">
              {imageOptions.map((img, i) => (
                <img
                  src={img.src || img}
                  alt={`drag-img-${i}`}
                  className="toolbar-img-thumb"
                  draggable
                  key={i}
                  onDragStart={ev => handleDragStart(ev, "image", img.src || img)}
                  style={{ background: "#fff" }}
                />
              ))}
            </div>
          </div>
          <div className="moodboard-toolbar-row">
            <span className="toolbar-label">Palettes</span>
            <div className="toolbar-scroller">
              {paletteOptions.map((pal, i) =>
                <div
                  className="toolbar-palette-thumb"
                  draggable
                  key={i}
                  onDragStart={ev => handleDragStart(ev, "palette", pal)}
                  style={{
                    background: "linear-gradient(90deg," + pal.join(",") + ")"
                  }}
                >
                  {pal.map((col, j) =>
                    <span
                      key={col + j}
                      className="toolbar-palette-color"
                      style={{ background: col }}
                    />
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="moodboard-footer">
          <button
            className="moodboard-save-btn"
            onClick={handleSaveBoard}
            disabled={saving || objects.length === 0}
          >
            {saving ? "Saving…" : "💾 Save Moodboard"}
          </button>
          <span className="moodboard-save-status">{saveNotice}</span>
        </div>
      </div>
      <div className="modal-bg-glow" />
    </div>
  );
}

// Individual image/palette object on moodboard
function MoodboardObj({ obj, selected, onDelete, onMouseDown }) {
  if (obj.type === "image") {
    return (
      <div
        className={`moodboard-obj moodboard-img${selected ? " selected" : ""}`}
        style={{
          left: obj.x, top: obj.y, width: obj.w, height: obj.h,
          zIndex: selected ? 9 : 1,
        }}
        tabIndex={0}
        onMouseDown={e => onMouseDown(e, obj.id, "move")}
      >
        <img
          src={obj.data}
          style={{
            width: "100%", height: "100%", borderRadius: 14,
            boxShadow: "0 2px 10px #79024118"
          }}
          draggable={false}
          alt="Moodboard"
        />
        <button
          className="obj-delete-btn"
          aria-label="Remove"
          onClick={ev => onDelete(obj.id, ev)}
        >×</button>
        <div
          className="obj-resize-handle"
          onMouseDown={e => onMouseDown(e, obj.id, "resize")}
          tabIndex={-1}
        />
      </div>
    );
  }
  if (obj.type === "palette") {
    let pal = [];
    try { pal = Array.isArray(obj.data) ? obj.data : JSON.parse(obj.data); } catch { pal = []; }
    return (
      <div
        className={`moodboard-obj moodboard-palette${selected ? " selected" : ""}`}
        style={{
          left: obj.x, top: obj.y, width: obj.w, height: obj.h,
          zIndex: selected ? 9 : 1,
          display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center"
        }}
        tabIndex={0}
        onMouseDown={e => onMouseDown(e, obj.id, "move")}
      >
        <div
          style={{
            width: "90%",
            height: "40%",
            borderRadius: 9,
            margin: "5px auto",
            background: pal.length > 0 ? `linear-gradient(90deg,${pal.join(",")})` : "#fff",
            boxShadow: "0 2px 10px #ff70ae23"
          }}
        />
        <div style={{ display: "flex", gap: "3px", marginTop: 7 }}>
          {pal.map((col, j) =>
            <span key={col + j}
              style={{
                display: "inline-block", width: 17, height: 17,
                borderRadius: "50%", background: col, border: "1.5px solid #fff",
                boxShadow: "0 1px 6px #79024124"
              }}
              title={col}
            />
          )}
        </div>
        <button
          className="obj-delete-btn"
          aria-label="Remove"
          onClick={ev => onDelete(obj.id, ev)}
        >×</button>
        <div
          className="obj-resize-handle"
          onMouseDown={e => onMouseDown(e, obj.id, "resize")}
          tabIndex={-1}
        />
      </div>
    );
  }
  return null;
}

export default MoodboardBuilder;
