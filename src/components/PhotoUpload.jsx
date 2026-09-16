import { useRef, useState } from "react";

export default function PhotoUpload({ onChange }) {
  const inputRef = useRef(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState("");

  function handleFiles(files) {
    const file = files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setError("Please choose an image file.");
      return;
    }
    if (file.size > 8 * 1024 * 1024) {
      setError("Image must be under 8 MB.");
      return;
    }
    setError("");
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    onChange?.(file);
  }

  function clear() {
    setPreviewUrl(null);
    setError("");
    if (inputRef.current) inputRef.current.value = "";
    onChange?.(null);
  }

  return (
    <div className="photo-upload">
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        capture="environment"
        hidden
        onChange={(e) => handleFiles(e.target.files)}
      />

      {previewUrl ? (
        <div className="photo-preview">
          <img src={previewUrl} alt="Report attachment preview" />
          <button type="button" className="photo-preview-remove" onClick={clear} aria-label="Remove photo">
            ✕
          </button>
        </div>
      ) : (
        <button
          type="button"
          className={`photo-dropzone ${dragOver ? "is-dragover" : ""}`}
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragOver(false);
            handleFiles(e.dataTransfer.files);
          }}
        >
          <CameraIcon />
          <span className="photo-dropzone-title">Add a photo</span>
          <span className="photo-dropzone-sub">Tap to take a picture or drag one in (optional)</span>
        </button>
      )}

      {error && <p className="photo-upload-error">{error}</p>}
    </div>
  );
}

function CameraIcon() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
      <path
        d="M4 8h3l1.5-2h7L17 8h3a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1Z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="13.5" r="3.4" stroke="currentColor" strokeWidth="1.7" />
    </svg>
  );
}
