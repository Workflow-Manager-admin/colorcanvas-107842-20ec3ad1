import React, { useState } from "react";
import "./ColorPaletteExplorer.css";

/**
 * ColorPaletteExplorer – Main interactive palette building tool.
 * Playful, modern, and immersive design using bold accent colors.
 * Includes color picker, palette display, random generator, and palette preview.
 */
// PUBLIC_INTERFACE
function ColorPaletteExplorer({ onPaletteSave }) {
  /**
   * Allows the user to build a palette via color picker, generate random, and preview results.
   * @param {Function} [onPaletteSave] - Optional callback when a palette is saved.
   */
  const [palette, setPalette] = useState(["#FF70AE", "#FCFCFC", "#790241"]);
  const [currentColor, setCurrentColor] = useState("#FF70AE");
  const [showCopiedNotice, setShowCopiedNotice] = useState(false);

  // Generate a random color (hex)
  function randomColor() {
    const c =
      "#" +
      Math.floor(Math.random() * 0xffffff)
        .toString(16)
        .padStart(6, "0")
        .toUpperCase();
    return c;
  }

  // Add current color to the palette
  function addColor() {
    if (palette.length >= 7) return;
    setPalette((prev) =>
      prev.includes(currentColor) ? prev : [...prev, currentColor]
    );
  }

  // Remove color from palette by index
  function removeColor(idx) {
    setPalette((prev) => prev.filter((_, i) => i !== idx));
  }

  // Generate random harmonious palette (simple algorithm)
  function generatePalette() {
    // Generates a palette (5 colors) - monochrome/analogous for vibrancy
    let first = randomColor();
    let pal = [first];
    for (let i = 1; i < 5; i++) {
      // Slightly shift hue for playfulness
      let base = parseInt(first.replace("#", ""), 16);
      let offset = 0x222222 * i;
      let hex =
        "#" +
        (((base + offset) % 0xffffff)
          .toString(16)
          .padStart(6, "0"))
          .toUpperCase();
      pal.push(hex);
    }
    setPalette(pal);
  }

  // PUBLIC_INTERFACE
  function handleCopyPalette() {
    // Copies color hexes to clipboard as CSV
    navigator.clipboard.writeText(palette.join(", ")).then(() => {
      setShowCopiedNotice(true);
      setTimeout(() => setShowCopiedNotice(false), 1200);
    });
  }

  // Save palette (callback for parent/dashboard)
  function handleSave() {
    if (onPaletteSave) onPaletteSave(palette);
    setShowCopiedNotice(false);
  }

  // PUBLIC_INTERFACE
  return (
    <div className="palette-explorer-container">
      <h2 className="palette-title">🎨 Color Palette Explorer</h2>
      <div className="palette-subtitle">
        Pick, craft or randomize vibrant palettes for your moodboards.<br />
        Try the playful picker, remix, and preview below!
      </div>
      {/* Main palette preview area */}
      <div className="palette-preview-section">
        <PaletteDisplay
          palette={palette}
          onRemoveColor={removeColor}
        />
        <div className="palette-preview-label">
          <span role="img" aria-label="Eye">👁️</span> Preview
        </div>
        <div className="palette-preview-demo">
          <PalettePreview palette={palette} />
        </div>
      </div>
      {/* Controls */}
      <div className="palette-controls-row">
        <input
          aria-label="Pick a color"
          type="color"
          className="palette-color-picker"
          value={currentColor}
          onChange={(e) => setCurrentColor(e.target.value.toUpperCase())}
          style={{ background: currentColor, border: "2.5px solid #e1e1e1" }}
        />
        <input
          className="palette-hex-input"
          aria-label="Hex input"
          type="text"
          value={currentColor}
          maxLength={7}
          onChange={(e) => {
            let val = e.target.value;
            if (!val.startsWith("#")) val = "#" + val;
            if (/^#[0-9a-fA-F]{0,6}$/.test(val))
              setCurrentColor(val.toUpperCase());
          }}
        />
        <button
          className="palette-btn add"
          onClick={addColor}
          disabled={
            palette.length >= 7 ||
            palette.includes(currentColor) ||
            !/^#[0-9A-F]{6}$/.test(currentColor)
          }
          title="Add color to palette"
        >
          + Add Color
        </button>
        <button className="palette-btn remix" onClick={generatePalette}>
          🔀 Remix Palette
        </button>
        <button className="palette-btn save" onClick={handleSave}>
          💾 Save Palette
        </button>
        <button className="palette-btn copy" onClick={handleCopyPalette}>
          📋 {showCopiedNotice ? "Copied!" : "Copy Hex"}
        </button>
      </div>
      <div className="palette-note">
        Max 7 colors per palette. Palette saves add to your dashboard. Hexes are copyable.
      </div>
    </div>
  );
}

// Visual display for the palette (hex swatches, removable)
function PaletteDisplay({ palette, onRemoveColor }) {
  return (
    <div className="palette-swatches">
      {palette.map((color, idx) => (
        <div
          className="palette-swatch"
          style={{
            background: color,
            color: "#FFF",
            boxShadow:
              idx === 0
                ? "0 0 0 3px #ff70ae90"
                : idx === palette.length - 1
                ? "0 0 0 3px #79024185"
                : "0 0 0 2px #ededed80",
          }}
          key={color}
        >
          <span className="palette-swatch-hex">{color}</span>
          {palette.length > 2 && (
            <button
              className="palette-remove-btn"
              aria-label="Remove color"
              onClick={() => onRemoveColor(idx)}
              tabIndex={0}
              title="Remove this color"
            >
              ×
            </button>
          )}
        </div>
      ))}
    </div>
  );
}

// Palette preview UI element (boxes, gradient bar, playful shapes)
function PalettePreview({ palette }) {
  return (
    <div className="palette-preview-box">
      {/* Gradient bar */}
      <div
        className="palette-gradient-bar"
        style={{
          background: `linear-gradient(90deg, ${palette.join(",")})`,
        }}
      />
      {/* Boxes & playful preview */}
      <div className="palette-bubbles-row">
        {palette.map((color, i) => (
          <div
            className="palette-bubble"
            style={{
              background: color,
              borderColor: i === 0 ? "#ff70ae" : i === palette.length - 1 ? "#790241" : "#fff",
              filter: i === Math.floor(palette.length / 2) ? "brightness(1.12) grayscale(0.1)" : "none",
            }}
            key={color + i}
          />
        ))}
      </div>
      {/* Quick palette demo sample */}
      <div className="palette-demo-cards-row">
        <div
          className="palette-demo-card"
          style={{
            background: palette[0],
            color: palette.length > 2 ? palette[2] : "#fff",
          }}
        >
          Accents
        </div>
        <div
          className="palette-demo-card"
          style={{
            background: palette[1] || "#eee",
            color: palette[0],
            border: "2.5px dashed #fcfcfc"
          }}
        >
          Main
        </div>
        <div
          className="palette-demo-card"
          style={{
            background: palette[palette.length - 1],
            color: "#FCFCFC",
            fontStyle: "italic",
            opacity: 0.87,
          }}
        >
          Bold
        </div>
      </div>
    </div>
  );
}

export default ColorPaletteExplorer;
