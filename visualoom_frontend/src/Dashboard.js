import React, { useState } from "react";
import "./Dashboard.css";

// ICONS for playful style
const ICONS = {
  quiz: "🖼️",
  palette: "🎨",
  inspo: "🌈",
  moodboard: "✨",
  dashboard: "🗂️",
  save: "💾"
};

const FEATURE_CARDS = [
  {
    key: "quiz",
    title: "Aesthetic Quiz",
    description:
      "Uncover your unique visual vibe! Take an image duel quiz to discover your style, favorite colors, and themes.",
    bg: "linear-gradient(101deg,#ff70ae 70%, #fcfcfc 120%)",
    icon: ICONS.quiz,
    actionLabel: "Start Quiz"
  },
  {
    key: "palette",
    title: "Palette Explorer",
    description:
      "Craft vibrant palettes! Try the playful color picker, remix button, and preview your favorite swatches.",
    bg: "linear-gradient(98deg,#fcfcfc 80%, #ff70ae 140%)",
    icon: ICONS.palette,
    actionLabel: "Explore Colors"
  },
  {
    key: "inspo",
    title: "Inspiration Gallery",
    description:
      "Explore curated visuals. Filter inspiration by mood, color, or style and view in immersive modal overlays.",
    bg: "linear-gradient(93deg,#fffcee 68%,#ff70ae 140%)",
    icon: ICONS.inspo,
    actionLabel: "Browse Gallery"
  },
  {
    key: "moodboard",
    title: "Moodboard Builder",
    description:
      "Drag images and palettes onto your virtual canvas. Compose moodboards, reposition, resize, and save.",
    bg: "linear-gradient(99deg,#fcfcfc 72%,#e8eaff 116%)",
    icon: ICONS.moodboard,
    actionLabel: "Create Moodboard"
  },
  {
    key: "dashboard",
    title: "My Dashboard",
    description:
      "View and organize your saved palettes, images, and boards. Everything at a glance in one playful space.",
    bg: "linear-gradient(90deg,#fffcee 34%,#fcfcfc 100%)",
    icon: ICONS.dashboard,
    actionLabel: "Go to Dashboard"
  }
];

// PUBLIC_INTERFACE
/**
 * VisuaLoom Dashboard — modern and playful.
 * Central feature cards, floating save FAB, and a sidebar for quick navigation.
 * All modals/actions are handled by parent for best integration; trigger via callbacks.
 * 
 * @param {Object} props
 * @param {Object} props.user - The logged-in user
 * @param {Function} [props.onFeature] - callback for feature launch: fn(key)
 */
function Dashboard({ user, onFeature = () => {} }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // PUBLIC_INTERFACE
  return (
    <div className="dashboard-main" style={{ minHeight: "100vh" }}>
      {/* Floating playful sidebar navigation */}
      <SidebarNav
        open={sidebarOpen}
        setOpen={setSidebarOpen}
        onFeature={onFeature}
        user={user}
      />
      {/* Header */}
      <h1 className="dashboard-title" style={{
        letterSpacing: ".056em",
        fontFamily: "inherit",
        marginTop: 12,
        marginBottom: 32
      }}>
        VisuaLoom Dashboard
      </h1>
      <div className="dashboard-section-cards"
        style={{
          gap: "36px",
          flexWrap: "wrap",
          justifyContent: "center",
          maxWidth: 1180,
          margin: "0 auto"
        }}
      >
        {/* Feature cards */}
        {FEATURE_CARDS.map(card => (
          <FeatureCard key={card.key} card={card} onFeature={onFeature} />
        ))}
      </div>
      {/* Floating Save Button (mock) for style; should be conditionally shown by parent in real app */}
      <SaveFAB />
    </div>
  );
}

/** Playful left sidebar nav with icons */
function SidebarNav({ open, setOpen, onFeature, user }) {
  // Responsive
  return (
    <nav
      className="dashboard-sidebar"
      style={{
        position: "fixed",
        left: open ? 0 : -70,
        top: 0,
        bottom: 0,
        background: "#fff0f8",
        width: open ? 80 : 40,
        borderTopRightRadius: 33,
        borderBottomRightRadius: 33,
        boxShadow: open
          ? "2px 4px 18px #ff70ae21"
          : "0 1px 9px #ff70ae12",
        zIndex: 1002,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        paddingTop: 31,
        transition: "left 0.28s cubic-bezier(.7,.1,.68,1.26),width 0.19s",
      }}
      aria-label="Sidebar Navigation"
    >
      <button
        style={{
          background: "#ff70ae",
          color: "#fff",
          border: "none",
          borderRadius: "18px",
          padding: open ? "8px 13px" : "7px 6px",
          marginBottom: 22,
          marginRight: open ? 0 : 6,
          boxShadow: "0 2px 7px #ff70ae66",
          fontWeight: 700,
          fontSize: "1.25rem",
          cursor: "pointer",
          outline: "none"
        }}
        aria-label={open ? "Hide sidebar" : "Show sidebar"}
        onClick={() => setOpen(!open)}
        tabIndex={0}
      >
        {open ? "⟨" : "⟩"}
      </button>
      {/* Nav icons */}
      <div style={{
        display: "flex",
        flexDirection: "column",
        gap: "14px",
        alignItems: "center",
        width: "100%"
      }}>
        {FEATURE_CARDS.map(card => (
          <button
            key={card.key}
            style={{
              background: "none",
              border: "none",
              color: "#ff70ae",
              fontSize: open ? "1.71rem" : "1.31rem",
              padding: open ? "11px 1px 7px 1px" : "6px 0 2px 0",
              width: "100%",
              borderRadius: "14px",
              cursor: "pointer",
              transition: "background 0.18s",
              outline: "none"
            }}
            title={card.title}
            aria-label={card.title}
            onClick={() => onFeature(card.key)}
            tabIndex={0}
            onMouseOver={e => e.currentTarget.style.background = "#ff70ae19"}
            onMouseOut={e => e.currentTarget.style.background = ""}
            onFocus={e => e.currentTarget.style.background = "#ff70ae35"}
            onBlur={e => e.currentTarget.style.background = ""}
          >
            <span>{card.icon}</span>
          </button>
        ))}
      </div>
      {/* User/Persona at bottom */}
      <div
        style={{
          position: "absolute",
          bottom: 33,
          left: 0,
          right: 0,
          textAlign: "center",
          fontSize: open ? "1.01rem" : "0.97rem",
          color: "#790241",
          fontWeight: 700,
          opacity: 0.93,
          background: open ? "#ff70ae10" : "transparent",
          borderRadius: "14px",
          padding: open ? "10px 2px" : 0,
          pointerEvents: "none"
        }}
        aria-live="polite"
      >
        {user?.persona_name && (
          <span style={{ fontWeight: 800 }} title="Persona name">
            {user.persona_name}
          </span>
        )}
      </div>
    </nav>
  );
}

/** Dashboard feature card */
function FeatureCard({ card, onFeature }) {
  return (
    <section
      className="dashboard-section"
      tabIndex={0}
      title={card.title}
      aria-label={card.title}
      style={{
        boxShadow: "0 5.6px 23px #ff70ae13,0 1px 2.1px #79024115",
        background: card.bg,
        border: card.key === "quiz"
          ? "2px solid #ff70ae44"
          : card.key === "palette"
          ? "2px solid #79024122"
          : "2px solid #ff70ae18",
        minHeight: 180,
        transition: "box-shadow .23s, transform .14s",
        textAlign: "left"
      }}
      onClick={() => onFeature(card.key)}
      onKeyDown={e => {
        if (e.key === "Enter" || e.key === " ") onFeature(card.key);
      }}
    >
      <div style={{
        fontSize: "2.25rem",
        marginBottom: 6,
        fontWeight: 800
      }}>{card.icon}</div>
      <h2 className="dashboard-section-title" style={{
        margin: 0,
        color: "#790241",
        fontWeight: 800,
        fontSize: "1.37rem",
        letterSpacing: ".03em"
      }}>{card.title}</h2>
      <p style={{
        color: "#a66164",
        marginTop: 6,
        fontWeight: 500,
        fontSize: "1.08rem",
        opacity: 0.97,
        lineHeight: 1.38,
        minHeight: 50
      }}>{card.description}</p>
      <button
        className="quiz-action-btn"
        style={{
          background: card.key === "quiz" ? "#ff70ae"
            : card.key === "palette" ? "#790241"
            : card.key === "dashboard" ? "#FCFCFC"
            : "#ff70ae",
          color: card.key === "dashboard" ? "#ff70ae" : "#fffcee",
          padding: "8px 28px",
          borderRadius: "22px",
          fontWeight: 700,
          fontSize: "1.06rem",
          boxShadow: "0 2px 8px #ff70ae22",
          marginTop: 17,
          marginBottom: 6,
          border: card.key === "dashboard" ? "1.7px solid #ff70ae39" : "none",
          transition: "background .16s"
        }}
        onClick={e => {
          e.stopPropagation();
          onFeature(card.key);
        }}
        tabIndex={0}
      >
        {card.actionLabel}
      </button>
    </section>
  );
}

/** Floating Action Save Button (example, actual save logic in parent/app) */
function SaveFAB() {
  return (
    <button
      className="dashboard-fab"
      style={{
        position: "fixed",
        right: "42px",
        bottom: "43px",
        zIndex: 1402,
        background: "linear-gradient(90deg,#ff70ae,#790241 110%)",
        color: "#fff",
        fontSize: "1.45rem",
        border: "none",
        borderRadius: "25px",
        fontWeight: 800,
        boxShadow: "0 8px 24px #ff70ae44, 0 2.5px 6px #4d006029",
        padding: "15px 32px",
        cursor: "pointer",
        outline: "none",
        transition: "background 0.15s"
      }}
      aria-label="Save"
      title="Save (FAB example)"
      tabIndex={0}
      onClick={() => alert("You pressed the Save FAB! (This is a style example; real saves in each feature.)")}
    >
      {ICONS.save} Save
    </button>
  );
}

export default Dashboard;
