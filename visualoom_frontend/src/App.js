import React, { useState, useEffect } from 'react';
import logo from './logo.svg';
import './App.css';
import AestheticQuiz from './AestheticQuiz';
import './AestheticQuiz.css';

// PUBLIC_INTERFACE
function App() {
  const [theme, setTheme] = useState('light');
  const [quizActive, setQuizActive] = useState(false);

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
        <button
          className="quiz-action-btn"
          style={{ margin: "18px auto 10px", fontSize: "1.1rem", padding: "10px 32px", borderRadius: "30px", background: "#ff70ae", boxShadow: "0px 3px 10px #ff70ae44" }}
          onClick={launchQuiz}
        >
          🎨 Discover My Aesthetic
        </button>
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
        {quizActive && (
          <AestheticQuiz onFinish={handleQuizFinish} />
        )}
      </header>
    </div>
  );
}

export default App;
