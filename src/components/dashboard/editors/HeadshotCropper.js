import React, { useState, useRef, useEffect } from "react";
import {
  UploadCloud,
  User,
  Trash2,
  Check,
  ZoomIn,
  ZoomOut,
} from "lucide-react";

export default function HeadshotCropper({
  currentImage,
  onCropComplete,
  onDelete,
  theme,
}) {
  const [imageSrc, setImageSrc] = useState(null); // The raw uploaded file (preview)
  const [cropPos, setCropPos] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const [processing, setProcessing] = useState(false);

  // Refs
  const imageRef = useRef(null);
  const containerRef = useRef(null);
  const dragStart = useRef({ x: 0, y: 0 });
  const fileInputRef = useRef(null);

  // Derived State
  // We are "editing" if there is a new imageSrc (raw file).
  // Otherwise we are just "viewing" the currentImage (final url).
  const isEditing = !!imageSrc;
  const activeImage = imageSrc || currentImage;

  // --- 1. HANDLE FILE SELECTION ---
  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setImageSrc(url);

      // RESET: Start fresh for the new file
      setZoom(1);
      setCropPos({ x: 0, y: 0 });
    }
  };

  // --- 2. GENERATE CROPPED IMAGE (Robust Math) ---
  const getCroppedImg = async () => {
    if (!imageRef.current || !containerRef.current) return;

    const canvas = document.createElement("canvas");
    const image = imageRef.current;

    // High-res output settings
    const OUTPUT_WIDTH = 900;
    const OUTPUT_HEIGHT = 1200;

    canvas.width = OUTPUT_WIDTH;
    canvas.height = OUTPUT_HEIGHT;
    const ctx = canvas.getContext("2d");

    // 1. Calculate Ratio (Canvas Pixels per Screen Pixel)
    // This ensures that 10px of drag on screen equals exactly the right amount of movement on canvas
    const containerRect = containerRef.current.getBoundingClientRect();
    const scaleX = OUTPUT_WIDTH / containerRect.width;
    const scaleY = OUTPUT_HEIGHT / containerRect.height;

    // 2. Fill background (Safety)
    ctx.fillStyle = "#000000";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 3. Move Origin to Center of Canvas
    ctx.translate(OUTPUT_WIDTH / 2, OUTPUT_HEIGHT / 2);

    // 4. Apply User Zoom
    ctx.scale(zoom, zoom);

    // 5. Apply User Pan (Scaled to Canvas units)
    ctx.translate(cropPos.x * scaleX, cropPos.y * scaleY);

    // 6. Draw Image
    // The CSS forces the image to `height: 100%` and `width: auto`.
    // We calculate what that height/width is in Canvas pixels.
    const drawnHeight = OUTPUT_HEIGHT;
    const drawnWidth = image.naturalWidth * (drawnHeight / image.naturalHeight);

    // Center the drawing relative to the cursor
    ctx.translate(-drawnWidth / 2, -drawnHeight / 2);

    ctx.drawImage(
      image,
      0,
      0,
      image.naturalWidth,
      image.naturalHeight, // Source dimensions
      0,
      0,
      drawnWidth,
      drawnHeight // Destination dimensions
    );

    return new Promise((resolve) => {
      canvas.toBlob(
        (blob) => {
          if (!blob) return;
          const file = new File([blob], "headshot_cropped.jpg", {
            type: "image/jpeg",
          });
          resolve(file);
        },
        "image/jpeg",
        0.9
      );
    });
  };

  // --- 3. SAVE HANDLER (THE FIX) ---
  const handleSaveCrop = async () => {
    if (!imageSrc) return;
    setProcessing(true);
    try {
      const croppedFile = await getCroppedImg();
      if (onCropComplete && croppedFile) {
        await onCropComplete({ file: croppedFile });

        // --- CRITICAL FIX ---
        // We must RESET the zoom/pos because the resulting image is ALREADY cropped.
        // If we don't reset, the viewer will apply the zoom a second time.
        setZoom(1);
        setCropPos({ x: 0, y: 0 });

        setImageSrc(null); // Exit edit mode
      }
    } catch (e) {
      console.error("Crop failed", e);
      alert("Failed to crop image. Please try again.");
    }
    setProcessing(false);
  };

  // --- 4. CANCEL HANDLER ---
  const handleCancel = () => {
    setImageSrc(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
    // Reset view so the previous image doesn't look weirdly zoomed
    setZoom(1);
    setCropPos({ x: 0, y: 0 });
  };

  // --- 5. DELETE LOGIC ---
  const handleDelete = () => {
    if (confirm("Are you sure you want to remove your headshot?")) {
      setImageSrc(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
      if (onDelete) onDelete();
      // Reset view
      setZoom(1);
      setCropPos({ x: 0, y: 0 });
    }
  };

  // --- 6. DRAG LOGIC ---
  const handleMouseDown = (e) => {
    // FIX: Only allow dragging if we are actually editing a new file
    if (!isEditing) return;

    e.preventDefault();
    setIsDragging(true);
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    dragStart.current = { x: clientX - cropPos.x, y: clientY - cropPos.y };
  };

  const handleMouseMove = (e) => {
    if (!isDragging || !isEditing) return;
    e.preventDefault();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;

    const newX = clientX - dragStart.current.x;
    const newY = clientY - dragStart.current.y;

    setCropPos({ x: newX, y: newY });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // --- 7. ZOOM LOGIC (Wheel) ---
  const handleWheel = (e) => {
    if (isEditing) {
      e.preventDefault();
      const newZoom = Math.min(Math.max(1, zoom - e.deltaY * 0.001), 3);
      setZoom(newZoom);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      {/* --- CROPPER WINDOW (3:4 RATIO) --- */}
      <div
        ref={containerRef}
        className={`relative w-full aspect-[3/4] rounded-2xl overflow-hidden border-2 border-dashed transition-all bg-black/20 select-none ${
          !activeImage
            ? `${theme.border} hover:border-emerald-500 cursor-pointer`
            : isEditing
            ? "cursor-move border-emerald-500/50 shadow-2xl"
            : "border-transparent"
        }`}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleMouseDown}
        onTouchMove={handleMouseMove}
        onTouchEnd={handleMouseUp}
        onWheel={handleWheel}
        onClick={() => !activeImage && fileInputRef.current?.click()}
      >
        {activeImage ? (
          <>
            <img
              ref={imageRef}
              src={activeImage}
              alt="Crop Target"
              draggable="false"
              className="absolute max-w-none origin-center transition-transform duration-75 ease-linear"
              style={{
                top: "50%",
                left: "50%",
                height: "100%", // Forces image to fill height
                width: "auto",
                // Apply transforms
                transform: `translate(-50%, -50%) translate(${cropPos.x}px, ${cropPos.y}px) scale(${zoom})`,
              }}
            />

            {/* GUIDES OVERLAY (Only show when editing) */}
            <div
              className={`absolute inset-0 pointer-events-none transition-opacity z-10 ${
                isEditing ? "opacity-100" : "opacity-0"
              }`}
            >
              {/* Grid Lines */}
              <div className="absolute inset-0 border border-white/20"></div>
              <div className="absolute top-1/3 w-full h-px bg-white/20 shadow-[0_1px_2px_rgba(0,0,0,0.3)]"></div>
              <div className="absolute top-2/3 w-full h-px bg-white/20 shadow-[0_1px_2px_rgba(0,0,0,0.3)]"></div>
              <div className="absolute left-1/3 h-full w-px bg-white/20 shadow-[1px_0_2px_rgba(0,0,0,0.3)]"></div>
              <div className="absolute left-2/3 h-full w-px bg-white/20 shadow-[1px_0_2px_rgba(0,0,0,0.3)]"></div>
            </div>
          </>
        ) : (
          /* EMPTY STATE */
          <div className="absolute inset-0 flex flex-col items-center justify-center hover:bg-white/5 transition-colors z-20">
            <User size={48} className="text-slate-600 mb-2" />
            <div className="text-xs font-bold text-slate-500 uppercase tracking-widest">
              Upload Headshot
            </div>
          </div>
        )}

        {/* Hidden Input */}
        <input
          type="file"
          ref={fileInputRef}
          accept="image/*"
          className="hidden"
          onChange={handleFileSelect}
        />
      </div>

      {/* --- CONTROLS --- */}
      <div className="flex flex-wrap items-center gap-2">
        {isEditing ? (
          // --- EDIT MODE CONTROLS ---
          <>
            <button
              onClick={handleCancel}
              className={`px-3 py-2 rounded-lg text-xs font-bold uppercase tracking-widest ${theme.inputBg} ${theme.border} border text-slate-400 hover:text-white`}
            >
              Cancel
            </button>

            {/* ZOOM BAR */}
            <div className="flex items-center gap-2 bg-black/40 rounded-full px-3 py-1 border border-white/10 mx-auto sm:mx-0">
              <ZoomOut size={14} className="text-slate-400 shrink-0" />
              <input
                type="range"
                min="1"
                max="3"
                step="0.05"
                value={zoom}
                onChange={(e) => setZoom(parseFloat(e.target.value))}
                className="w-24 h-1 bg-slate-600 rounded-lg appearance-none cursor-pointer accent-emerald-500"
              />
              <ZoomIn size={14} className="text-slate-400 shrink-0" />
            </div>

            <button
              onClick={handleSaveCrop}
              disabled={processing}
              className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-xs font-bold uppercase tracking-widest bg-emerald-500 text-white hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-500/20"
            >
              {processing ? (
                <span className="animate-pulse">Processing...</span>
              ) : (
                <>
                  <Check size={16} /> Save
                </>
              )}
            </button>
          </>
        ) : (
          // --- VIEW MODE CONTROLS ---
          <>
            <button
              onClick={() => fileInputRef.current?.click()}
              className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all whitespace-nowrap ${theme.inputBg} ${theme.border} border text-slate-400 hover:text-white hover:border-emerald-500`}
            >
              <UploadCloud size={14} />{" "}
              {activeImage ? "Replace Headshot" : "Upload Headshot"}
            </button>

            {activeImage && (
              <button
                onClick={handleDelete}
                className="shrink-0 flex items-center justify-center w-8 h-8 rounded-lg border transition-all bg-red-500/10 border-red-500/20 text-red-500 hover:bg-red-500 hover:text-white"
                title="Remove Headshot"
              >
                <Trash2 size={14} />
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
}
