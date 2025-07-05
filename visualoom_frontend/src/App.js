import React, { useState, useEffect } from 'react';
import logo from './logo.svg';
import './App.css';
import AestheticQuiz from './AestheticQuiz';
import './AestheticQuiz.css';
import ColorPaletteExplorer from './ColorPaletteExplorer';
import './ColorPaletteExplorer.css';
import Dashboard from './Dashboard';
import InspirationGallery from "./InspirationGallery";
import "./InspirationGallery.css";
import { supabase } from './supabaseClient';
import MoodboardBuilder from './MoodboardBuilder';
import './MoodboardBuilder.css';
import Auth from './Auth';

// PUBLIC_INTERFACE
function App() {
  const [theme, setTheme] = useState('light');
  const [quizActive, setQuizActive] = useState(false);
  const [paletteActive, setPaletteActive] = useState(false);
  const [dashboardActive, setDashboardActive] = useState(false);
  const [galleryActive, setGalleryActive] = useState(false);
  const [moodboardActive, setMoodboardActive] = useState(false);

  // Auth and session state
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [authChecked, setAuthChecked] = useState(false);

  // Effect to apply theme to document element
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Session Listener for Supabase Auth
  useEffect(() => {
    // Try to restore user session (if any)
    async function checkSession() {
      const session = (await supabase.auth.getSession()).data.session;
      setUser(session?.user || null);
      setAuthChecked(true);
    }
    checkSession();
    // subscribe to auth changes
    const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user || null);
      setAuthChecked(true);
    });
    return () => {
      listener?.subscription?.unsubscribe();
    };
  }, []);

  // Fetch persona/onboarding data if user is logged in
  useEffect(() => {
    async function fetchProfile() {
      if (!user) { setProfile(null); return; }
      try {
        const { data } = await supabase.from("user_profile").select("*").eq("user_id", user.id).single();
        setProfile(data || null);
      } catch { setProfile(null); }
    }
    if (user) fetchProfile();
  }, [user]);

  // Logout handler
  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
  };

  // PUBLIC_INTERFACE
  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };

  // Start the quiz - in a modal overlay
  const launchQuiz = () => setQuizActive(true);

  // Palette explorer open/close
  const openPaletteExplorer = () => setPaletteActive(true);
  const closePaletteExplorer = () => setPaletteActive(false);

  // Save palette to Supabase and notify (show dashboard after save)
  const handlePaletteSave = async (palette) => {
    closePaletteExplorer();
    try {
      await supabase.from("saved_palettes").insert([
        { user_id: user.id, palette: JSON.stringify(palette), saved_at: new Date().toISOString() }
      ]);
      setDashboardActive(true);
    } catch (err) {
      alert("Failed to save palette.");
    }
  };

  // Save image to Supabase from quiz result (called by child)
  const handleQuizFinish = async (summary) => {
    setQuizActive(false);
    try {
      for (let img of summary?.pickedImages || []) {
        await supabase.from("saved_images").insert([
          {
            user_id: user.id,
            image_url: img.src.medium,
            photographer: img.photographer || "",
            saved_at: new Date().toISOString(),
          }
        ]);
      }
      setDashboardActive(true);
    } catch (err) {
      alert("Failed to save image(s)");
    }
  };

  // Moodboard palette/image drag options (dashboard preview)
  const [paletteCache, setPaletteCache] = useState([]);
  const [imageCache, setImageCache] = useState([]);

  // Fetch for moodboard sidebar tools when modal is opened
  useEffect(() => {
    async function fetchCaches() {
      if (moodboardActive && user?.id) {
        // Get user's palettes & images for toolbar
        let { data: pals } = await supabase
          .from("saved_palettes")
          .select("*")
          .eq("user_id", user.id)
          .order("saved_at", { ascending: false });
        let { data: imgs } = await supabase
          .from("saved_images")
          .select("*")
          .eq("user_id", user.id)
          .order("saved_at", { ascending: false });
        setPaletteCache(
          (pals || [])
            .map(p => {
              try {
                if (typeof p.palette === "string") return JSON.parse(p.palette);
                return p.palette;
              } catch {
                return [];
              }
            })
            .filter(x => Array.isArray(x) && x.length > 0)
        );
        setImageCache((imgs || []).map(im => im.image_url));
      }
    }
    if (moodboardActive && user?.id) fetchCaches();
  }, [moodboardActive, user]);

  // Navigation helpers
  const goToDashboard = () => setDashboardActive(true);
  const closeDashboard = () => setDashboardActive(false);

  if (!authChecked) {
    // You may want a spinner here for better UX
    return (
      <div className="quiz-overlay" style={{ zIndex: 1600, background: "rgba(255,250,254,0.98)" }}>
        <div style={{
          color: "#ff70ae",
          fontWeight: 600,
          fontSize: "1.19rem",
          background: "#fff",
          borderRadius: "32px",
          padding: "64px 52px",
          margin: "90px auto",
          maxWidth: 400,
          boxShadow: "0 2px 24px #ff70ae33"
        }}>
          Loading...
        </div>
      </div>
    );
  }

  if (!user) {
    // Show login/signup onboarding modal
    return <Auth onAuth={setUser} />;
  }

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

        {/* Personalized user greeting - playful! */}
        {user && (
          <div
            style={{
              color: "#790241",
              fontWeight: 700,
              margin: "18px auto 0",
              background: "#fcfcfc",
              borderRadius: "16px",
              padding: "6px 19px 7px",
              fontSize: "1.12rem",
              width: "fit-content"
            }}
            aria-live="polite"
          >
            👋 Hi, {profile?.persona_name || user.email?.split("@")[0]}!
            <button
              className="quiz-action-btn"
              onClick={handleLogout}
              style={{
                marginLeft: 18,
                fontSize: "0.91rem",
                borderRadius: "12px",
                background: "#fffcee",
                color: "#ff70ae",
                border: "1.2px solid #ff70ae56",
                fontWeight: 700
              }}
              aria-label="Logout"
            >
              Logout
            </button>
          </div>
        )}

        {/* Dashboard nav cards/buttons */}
        <div style={{
          display: "flex",
          gap: "32px",
          justifyContent: "center",
          marginTop: 24,
          marginBottom: 5,
          flexWrap: "wrap"
        }}>
          <button
            className="quiz-action-btn"
            style={{
              fontSize: "1.08rem",
              padding: "10px 28px",
              borderRadius: "30px",
              background: "#ff70ae",
              boxShadow: "0px 3px 12px #ff70ae44"
            }}
            onClick={launchQuiz}
          >
            🖼️ Discover My Aesthetic
          </button>
          <button
            className="quiz-action-btn"
            style={{
              fontSize: "1.08rem",
              padding: "10px 28px",
              borderRadius: "30px",
              background: "#790241",
              color: "#fffcee",
              boxShadow: "0px 3px 12px #79024122"
            }}
            onClick={openPaletteExplorer}
          >
            🎨 Palette Explorer
          </button>
          <button
            className="quiz-action-btn"
            style={{
              fontSize: "1.08rem",
              padding: "10px 28px",
              borderRadius: "30px",
              background: "#FCFCFC",
              color: "#ff70ae",
              boxShadow: "0px 3px 12px #7902410b",
              border: "1.7px solid #ff70ae66"
            }}
            onClick={goToDashboard}
          >
            🗂️ Dashboard
          </button>
        </div>
        {/* Inspiration Gallery floating button */}
        {!galleryActive && !quizActive && !paletteActive && !dashboardActive && !moodboardActive && (
          <>
          <button
            className="inspo-float-btn"
            aria-label="Open Inspiration Gallery"
            style={{
              position: "fixed",
              right: "38px",
              bottom: "38px",
              zIndex: 100,
              background: "linear-gradient(84deg, #ff70ae 76%, #790241 110%)",
              color: "#fff",
              fontSize: "1.21rem",
              border: "none",
              borderRadius: "24px",
              fontWeight: 700,
              boxShadow: "0 6px 18px #ff70ae44, 0 1.5px 6px #4d006044",
              padding: "13px 32px",
              cursor: "pointer",
              outline: "none"
            }}
            onClick={() => setGalleryActive(true)}
          >
            🌈 Inspiration Gallery
          </button>
          <button
            className="moodboard-float-btn"
            aria-label="Open Moodboard Builder"
            style={{
              position: "fixed",
              right: "38px",
              bottom: "114px",
              zIndex: 101,
              background: "linear-gradient(105deg,#ff70ae 68%,#fff4fc 98%)",
              color: "#790241",
              fontSize: "1.18rem",
              border: "none",
              borderRadius: "23px",
              fontWeight: 800,
              boxShadow: "0 7px 21px #ff70ae58, 0 1.5px 6px #79024122",
              padding: "12px 21px",
              cursor: "pointer",
              outline: "none"
            }}
            onClick={() => setMoodboardActive(true)}
          >
            ✨ Build Moodboard
          </button>
          </>
        )}
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
        {dashboardActive && (
          <div className="quiz-overlay" style={{ zIndex: 1500, background: "rgba(255,255,255,0.97)" }}>
            <div style={{ position: "absolute", top: 20, right: 34, zIndex: 2100 }}>
              <button
                aria-label="Close Dashboard"
                onClick={closeDashboard}
                style={{
                  background: "#790241",
                  color: "#fff",
                  border: "none",
                  borderRadius: "22px",
                  fontSize: "1.32rem",
                  fontWeight: "bold",
                  padding: "7px 19px",
                  boxShadow: "0 1px 9px #79024121",
                  cursor: "pointer"
                }}>
                ✕
              </button>
            </div>
            <div style={{
              maxWidth: 1200,
              margin: "0 auto",
              marginTop: "9vh",
              borderRadius: 38,
              overflow: "hidden",
              boxShadow: "0 1px 20px #ff70ae23, 0 1px 2.5px #79024118"
            }}>
              <Dashboard user={user} />
            </div>
          </div>
        )}
        {moodboardActive && (
          <MoodboardBuilder
            open={moodboardActive}
            onClose={() => setMoodboardActive(false)}
            user={user}
            paletteOptions={paletteCache}
            imageOptions={imageCache.map(url => ({ src: url }))}
          />
        )}
        {/* InspirationGallery modal */}
        {galleryActive && (
          <InspirationGallery asModal onClose={() => setGalleryActive(false)} />
        )}
      </header>
    </div>
  );
}

export default App;
