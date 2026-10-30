import React, { useEffect, useState } from "react";
import {
  Camera, Video, Upload, Trash2, Pencil, X, Save,
  CalendarDays, Images, Play, Clock, Shuffle
} from "lucide-react";

const DB_NAME = "LittlePlaceMemories";
const STORE = "memories";

function openDatabase() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);

    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE)) {
        db.createObjectStore(STORE, { keyPath: "id" });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function databaseAction(mode, action, data) {
  const db = await openDatabase();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE, mode);
    const store = transaction.objectStore(STORE);
    const request = action === "getAll"
      ? store.getAll()
      : action === "put"
      ? store.put(data)
      : store.delete(data);

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
    transaction.oncomplete = () => db.close();
    transaction.onerror = () => {
      db.close();
      reject(transaction.error);
    };
  });
}

export function MemoriesStudio() {
  const [memories, setMemories] = useState([]);
  const [urls, setUrls] = useState({});
  const [file, setFile] = useState(null);
  const [caption, setCaption] = useState("");
  const [memoryDate, setMemoryDate] = useState(
    new Date().toISOString().slice(0, 10)
  );
  const [editing, setEditing] = useState(null);
  const [editCaption, setEditCaption] = useState("");
  const [editDate, setEditDate] = useState("");
  const [viewing, setViewing] = useState(null);
  const [notice, setNotice] = useState("");
  const [loading, setLoading] = useState(true);
  const [sort, setSort] = useState("newest");

  async function loadMemories() {
    try {
      const saved = await databaseAction("readonly", "getAll");
      setMemories(saved || []);
      setNotice("");
    } catch (error) {
      setNotice("We couldn't open your memory storage. Please check browser storage permissions.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadMemories();
  }, []);

  useEffect(() => {
    const next = {};
    memories.forEach(memory => {
      next[memory.id] = URL.createObjectURL(memory.file);
    });
    setUrls(next);

    return () => {
      Object.values(next).forEach(url => URL.revokeObjectURL(url));
    };
  }, [memories]);

  async function saveMemory(event) {
    event.preventDefault();

    if (!file) {
      setNotice("Choose a photograph or video first.");
      return;
    }

    if (file.size > 60 * 1024 * 1024) {
      setNotice("This file is too large. Please choose a file under 60 MB.");
      return;
    }

    const memory = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
      caption: caption.trim() || "A little moment worth remembering",
      date: memoryDate,
      type: file.type.startsWith("video/") ? "video" : "image",
      file,
      fileName: file.name,
      createdAt: Date.now()
    };

    try {
      await databaseAction("readwrite", "put", memory);
      setFile(null);
      setCaption("");
      setMemoryDate(new Date().toISOString().slice(0, 10));
      event.target.reset();
      setNotice("Your memory has been saved on this device.");
      await loadMemories();
    } catch (error) {
      setNotice("Couldn't save this file. Your browser may be running low on storage.");
    }
  }

  function startEditing(memory) {
    setEditing(memory.id);
    setEditCaption(memory.caption);
    setEditDate(memory.date);
  }

  async function saveEdit(id) {
    const memory = memories.find(item => item.id === id);
    if (!memory) return;

    try {
      await databaseAction("readwrite", "put", {
        ...memory,
        caption: editCaption.trim() || "A little moment worth remembering",
        date: editDate
      });
      setEditing(null);
      setNotice("Your memory has been updated.");
      await loadMemories();
    } catch (error) {
      setNotice("We couldn't update that memory.");
    }
  }

  async function deleteMemory(id) {
    if (!window.confirm("Delete this memory permanently from this device?")) return;

    try {
      await databaseAction("readwrite", "delete", id);
      setViewing(null);
      setNotice("Memory deleted.");
      await loadMemories();
    } catch (error) {
      setNotice("We couldn't delete that memory.");
    }
  }

  const sorted = [...memories].sort((a, b) =>
    sort === "newest"
      ? b.date.localeCompare(a.date)
      : a.date.localeCompare(b.date)
  );

  const randomMemory = () => {
    if (!memories.length) {
      setNotice("Save a few memories first. Then we'll surprise you!");
      return;
    }
    const item = memories[Math.floor(Math.random() * memories.length)];
    setViewing(item.id);
  };

  const current = memories.find(item => item.id === viewing);

  return (
    <div className="memories-studio">
      <div className="memory-intro-row">
        <div>
          <span className="eyebrow">YOUR PERSONAL SCRAPBOOK</span>
          <h2>Keep the little <em>moments.</em></h2>
          <p>Photographs, videos and the stories behind them. All in one little place.</p>
        </div>
        <button className="secondary-button" onClick={randomMemory}>
          <Shuffle size={15} /> Surprise me
        </button>
      </div>

      <form className="memory-upload-panel" onSubmit={saveMemory}>
        <div className="memory-upload-heading">
          <Camera size={24} />
          <div>
            <h3>Add a new memory</h3>
            <p>Choose a photo or video and give it a little story.</p>
          </div>
        </div>

        <label className="memory-file-picker">
          <Upload size={23} />
          <strong>{file ? file.name : "Choose a photo or video"}</strong>
          <span>Images or videos · Maximum 60 MB per file</span>
          <input
            type="file"
            accept="image/*,video/*"
            onChange={event => {
              setFile(event.target.files?.[0] || null);
              setNotice("");
            }}
            required
          />
        </label>

        {file && (
          <div className="memory-selected-file">
            {file.type.startsWith("video/") ? <Video size={17} /> : <Images size={17} />}
            {file.name}
            <button type="button" onClick={() => setFile(null)} aria-label="Remove selected file">
              <X size={16} />
            </button>
          </div>
        )}

        <label className="memory-form-label">
          Caption or little story
          <textarea
            value={caption}
            onChange={event => setCaption(event.target.value)}
            rows="3"
            placeholder="What makes this moment special?"
          />
        </label>

        <label className="memory-form-label">
          <CalendarDays size={15} /> Date of the memory
          <input
            type="date"
            value={memoryDate}
            onChange={event => setMemoryDate(event.target.value)}
            required
          />
        </label>

        <button className="primary-button" type="submit">
          Save this memory <Save size={16} />
        </button>
      </form>

      {notice && <div className="memory-notice">{notice}</div>}

      <div className="memory-library-heading">
        <div>
          <span className="eyebrow">THE MEMORY COLLECTION</span>
          <h2>Your scrapbook <em>({memories.length})</em></h2>
        </div>
        <select value={sort} onChange={event => setSort(event.target.value)}>
          <option value="newest">Newest first</option>
          <option value="oldest">Oldest first</option>
        </select>
      </div>

      {loading ? (
        <div className="empty-gallery">Loading your memories...</div>
      ) : sorted.length === 0 ? (
        <div className="empty-gallery">
          <Images size={35} />
          <h3>Your story starts here.</h3>
          <p>Add your first photograph or video to begin your scrapbook.</p>
        </div>
      ) : (
        <div className="memory-gallery">
          {sorted.map(memory => (
            <article className="memory-item" key={memory.id}>
              <button className="memory-preview" onClick={() => setViewing(memory.id)}>
                {urls[memory.id] && memory.type === "image" ? (
                  <img src={urls[memory.id]} alt={memory.caption} />
                ) : urls[memory.id] ? (
                  <video src={urls[memory.id]} muted playsInline />
                ) : null}
                {memory.type === "video" && <span className="memory-play"><Play size={23} /></span>}
              </button>

              <div className="memory-item-content">
                {editing === memory.id ? (
                  <div className="memory-edit-form">
                    <textarea value={editCaption} onChange={event => setEditCaption(event.target.value)} rows="3" />
                    <input type="date" value={editDate} onChange={event => setEditDate(event.target.value)} />
                    <div>
                      <button className="primary-button" onClick={() => saveEdit(memory.id)}>
                        <Save size={14} /> Save
                      </button>
                      <button className="secondary-button" onClick={() => setEditing(null)}>Cancel</button>
                    </div>
                  </div>
                ) : (
                  <>
                    <strong>{memory.caption}</strong>
                    <span className="memory-date"><CalendarDays size={13} /> {memory.date}</span>
                    <div className="memory-actions">
                      <button onClick={() => setViewing(memory.id)}><Images size={14} /> View</button>
                      <button onClick={() => startEditing(memory)}><Pencil size={14} /> Edit</button>
                      <button onClick={() => deleteMemory(memory.id)}><Trash2 size={14} /> Delete</button>
                    </div>
                  </>
                )}
              </div>
            </article>
          ))}
        </div>
      )}

      {current && (
        <div className="memory-viewer" onClick={() => setViewing(null)}>
          <div className="memory-viewer-content" onClick={event => event.stopPropagation()}>
            <button className="memory-viewer-close" onClick={() => setViewing(null)} aria-label="Close">
              <X size={22} />
            </button>
            {urls[current.id] && current.type === "image" ? (
              <img src={urls[current.id]} alt={current.caption} />
            ) : urls[current.id] ? (
              <video src={urls[current.id]} controls autoPlay playsInline />
            ) : null}
            <h3>{current.caption}</h3>
            <p><CalendarDays size={14} /> {current.date}</p>
          </div>
        </div>
      )}

      <p className="memory-storage-note">
        <Clock size={14} /> Your memories are stored locally in this browser on this device.
        Clearing browser data or changing devices may remove or make them unavailable.
        Keep separate backups of important files.
      </p>
    </div>
  );
}
