import React, { useState, useEffect } from 'react';
import logo from './logo.svg';
import './App.css';
import AestheticQuiz from './AestheticQuiz';
import './AestheticQuiz.css';
import ColorPaletteExplorer from './ColorPaletteExplorer';
import './ColorPaletteExplorer.css';

// PUBLIC_INTERFACE
function App() {
  const [theme, setTheme] = useState('light');
  const [quizActive, setQuizActive] = useState(false);
  const [paletteActive, setPaletteActive] = useState(false);

  // Effect to apply theme to document element
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // PUBLIC_INTERFACE
  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };

  // Start the quiz - in a modal overlay
  const launchQuiz = () => setQuizActive(true);
  // Handler for closing quiz at the end
  const handleQuizFinish = () => setQuizActive(false);

  // Palette explorer open/close
  const openPaletteExplorer = () => setPaletteActive(true);
  const closePaletteExplorer = () => setPaletteActive(false);
  const handlePaletteSave = (palette) => {
    // For future: save to dashboard, show toast, etc.
    closePaletteExplorer();
  };

  return (
    <div className="App">
      <header className="App-header">
        <button 
          className="theme-toggle" 
          onClick={toggleTheme}
          aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
        >
          {theme === 'light' ? '🌙 Dark' : '☀️ Light'}
        </button>
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          <strong>VisuaLoom</strong> — Playful Aesthetic Discovery
        </p>
        {/* Dashboard nav cards/buttons */}
        <div style={{ display: "flex", gap: "32px", justifyContent: "center", marginTop: 24, marginBottom: 5, flexWrap: "wrap" }}>
          <button
            className="quiz-action-btn"
            style={{ fontSize: "1.08rem", padding: "10px 28px", borderRadius: "30px", background: "#ff70ae", boxShadow: "0px 3px 12px #ff70ae44" }}
            onClick={launchQuiz}
          >
            🖼️ Discover My Aesthetic
          </button>
          <button
            className="quiz-action-btn"
            style={{ fontSize: "1.08rem", padding: "10px 28px", borderRadius: "30px", background: "#790241", color: "#fffcee", boxShadow: "0px 3px 12px #79024122"}}
            onClick={openPaletteExplorer}
          >
            🎨 Palette Explorer
          </button>
        </div>
        <p>
          Current theme: <strong>{theme}</strong>
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
        {/* Modal overlays */}
        {quizActive && (
          <AestheticQuiz onFinish={handleQuizFinish} />
        )}
        {paletteActive && (
          <div className="quiz-overlay" style={{ zIndex: 1100, background: "rgba(250,220,241,.92)" }}>
            <div style={{ position: "absolute", top: 34, right: 34, zIndex: 2000 }}>
              <button
                aria-label="Close Palette Explorer"
                onClick={closePaletteExplorer}
                style={{
                  background: "#ff70ae",
                  color: "#fff",
                  border: "none",
                  borderRadius: "22px",
                  fontSize: "1.32rem",
                  fontWeight: "bold",
                  padding: "7px 19px",
                  boxShadow: "0 1px 8px #ff70ae44",
                  cursor: "pointer"
                }}>
                ✕
              </button>
            </div>
            <ColorPaletteExplorer onPaletteSave={handlePaletteSave} />
          </div>
        )}
      </header>
    </div>
  );
}

export default App;
