import React, { useState } from "react";
import { supabase } from "./supabaseClient";

/**
 * PUBLIC_INTERFACE
 * Auth component for signup/login (with playful onboarding & persona quiz prompt).
 * Handles session updates and invokes onAuth callback with user info.
 * @param {object} props
 * @param {function} props.onAuth - Called with auth'd user object
 */
function Auth({ onAuth }) {
  const [mode, setMode] = useState("login"); // 'login' or 'signup'
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [showPersonaPrompt, setShowPersonaPrompt] = useState(false);
  const [personaName, setPersonaName] = useState("");

  // PUBLIC_INTERFACE
  async function handleSubmit(e) {
    e.preventDefault();
    setErrorMsg("");
    setLoading(true);
    try {
      let result;
      if (mode === "login") {
        result = await supabase.auth.signInWithPassword({ email, password });
        if (result.error) throw result.error;
        // If onboarding data not set, consider new user flow
        onAuth(result.data.user);
      } else {
        result = await supabase.auth.signUp({ email, password });
        if (result.error) throw result.error;
        setShowPersonaPrompt(true);
      }
    } catch (err) {
      setErrorMsg(err.message || "Error logging in.");
    }
    setLoading(false);
  }

  // PUBLIC_INTERFACE
  async function handlePersonaSave() {
    setLoading(true);
    setErrorMsg("");
    try {
      // Upsert persona info into user_profile
      // We'll use Supabase's public schema, assuming a 'user_profile' table exists
      const user = (await supabase.auth.getUser()).data.user;
      await supabase.from("user_profile").upsert([
        { user_id: user.id, persona_name: personaName }
      ], { onConflict: ["user_id"] });
      if (onAuth) onAuth(user);
    } catch (err) {
      setErrorMsg("Could not save persona: " + (err.message || ""));
    }
    setLoading(false);
  }

  if (showPersonaPrompt) {
    return (
      <div className="quiz-overlay" style={{ zIndex: 1600, background: "rgba(255,250,254,0.98)" }}>
        <div style={{
          background: "#fff",
          borderRadius: "38px",
          boxShadow: "0 6px 32px 2px #ff70ae29",
          padding: "36px 32px",
          maxWidth: 420,
          width: "98vw",
          margin: "40px auto",
          display: "flex",
          flexDirection: "column",
          alignItems: "center"
        }}>
          <h2 style={{ color: "#ff70ae", fontWeight: 800, fontSize: "2.11rem", marginBottom: 14 }}>
            Welcome to VisuaLoom!
          </h2>
          <div style={{ color: "#790241", fontWeight: 600, marginBottom: 18 }}>
            Let's set your creative persona. <br />
            <span style={{fontWeight:400, fontSize:'0.97rem'}}>What should we call you?</span>
          </div>
          <input
            className="moodboard-title-input"
            placeholder="Your persona or nickname…"
            value={personaName}
            maxLength={18}
            onChange={e => setPersonaName(e.target.value.slice(0,18))}
            style={{
              margin: "0 auto 13px",
              fontSize: "1.23rem",
              width: "82%"
            }}
          />
          <button
            className="quiz-action-btn quiz-action-finish"
            onClick={handlePersonaSave}
            disabled={!personaName || loading}
            style={{ padding: "10px 38px", fontSize: "1rem" }}
          >
            {loading ? "Saving…" : "Start Exploring →"}
          </button>
          {errorMsg && (
            <div style={{ color: "#ff2211", marginTop: 10, fontWeight: 600 }}>{errorMsg}</div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="quiz-overlay" style={{ zIndex: 1600, background: "rgba(255,250,254,0.98)" }}>
      <div style={{
        background: "#fff",
        borderRadius: "38px",
        boxShadow: "0 6px 32px 2px #ff70ae29",
        padding: "36px 32px",
        maxWidth: 380,
        width: "98vw",
        margin: "40px auto",
        display: "flex",
        flexDirection: "column",
        alignItems: "center"
      }}>
        <h2 style={{
          color: "#ff70ae",
          fontWeight: 800,
          fontSize: "2.11rem",
          marginBottom: 14
        }}>
          {mode === "login" ? "Login" : "Sign Up"}
        </h2>
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", width: "100%" }}>
          <input
            type="email"
            placeholder="Email"
            autoComplete="username"
            className="moodboard-title-input"
            style={{ margin: "0 0 13px", fontSize: "1rem" }}
            value={email}
            onChange={e => setEmail(e.target.value)}
            disabled={loading}
            required
          />
          <input
            type="password"
            minLength={6}
            placeholder="Password (min 6 chars)"
            autoComplete={mode === "login" ? "current-password" : "new-password"}
            className="moodboard-title-input"
            style={{ margin: "0 0 16px", fontSize: "1rem" }}
            value={password}
            onChange={e => setPassword(e.target.value)}
            disabled={loading}
            required
          />
          <button
            className="quiz-action-btn"
            disabled={loading}
            style={{ background: "#ff70ae", color: "#fff", fontWeight: 700, fontSize: "1.1rem" }}
            type="submit"
          >
            {loading
              ? (mode === "login" ? "Logging in…" : "Creating…")
              : mode === "login" ? "Login" : "Sign Up"}
          </button>
        </form>
        <div style={{ marginTop: 20, color: "#a66164", fontWeight: 500, fontSize: ".95rem" }}>
          {mode === "login" ? (
            <>
              Need an account?{" "}
              <button
                type="button"
                onClick={() => setMode("signup")}
                className="quiz-action-btn"
                style={{
                  background: "#fffcee",
                  color: "#ff70ae",
                  fontWeight: 700,
                  fontSize: "0.97rem",
                  border: "1.4px solid #ff70ae56",
                  borderRadius: "16px",
                  marginLeft: 5
                }}
              >
                Sign Up
              </button>
            </>
          ) : (
            <>
              Already registered?{" "}
              <button
                type="button"
                onClick={() => setMode("login")}
                className="quiz-action-btn"
                style={{
                  background: "#FCFCFC",
                  color: "#790241",
                  fontWeight: 700,
                  fontSize: "0.97rem",
                  border: "1.4px solid #79024137",
                  borderRadius: "16px",
                  marginLeft: 5
                }}
              >
                Login
              </button>
            </>
          )}
        </div>
        {errorMsg && (
          <div style={{ color: "#ff2211", marginTop: 13, fontWeight: 600 }}>{errorMsg}</div>
        )}
      </div>
    </div>
  );
}

export default Auth;
