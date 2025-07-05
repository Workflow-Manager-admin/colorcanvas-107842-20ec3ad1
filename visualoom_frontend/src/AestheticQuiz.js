import React, { useState, useEffect } from "react";
import { usePexels } from "./usePexels";
import "./AestheticQuiz.css";

/**
 * Image Duel UI for Aesthetic Discovery Quiz.
 * Modern, playful style: large images, overlays, color, rounded cards, animated transitions.
 */

const DUELS_PER_QUIZ = 8; // How many duels per session

// PUBLIC_INTERFACE
function AestheticQuiz({ onFinish }) {
  /**
   * Renders an aesthetic discovery quiz.
   * @param {Function} onFinish - Callback called with result summary at end.
   */
  const [step, setStep] = useState(0); // current duel index
  const [selections, setSelections] = useState([]); // user choices (array of {left|right})
  const [duelPairs, setDuelPairs] = useState([]); // array of 2-image arrays
  const [ready, setReady] = useState(false);
  const { images, loading, error, fetchCurated } = usePexels();

  // Fetch curated images and prep pairs for duels
  useEffect(() => {
    fetchCurated({ per_page: 18 }); // Fetch more than needed to allow randomness
  }, []);

  useEffect(() => {
    if (!loading && images.length >= 2 * DUELS_PER_QUIZ) {
      // Randomize and generate pairs
      const shuffled = [...images].sort(() => Math.random() - 0.5);
      const pairs = [];
      for (let i = 0; i < DUELS_PER_QUIZ; i++) {
        pairs.push([shuffled[i * 2], shuffled[i * 2 + 1]]);
      }
      setDuelPairs(pairs);
      setReady(true);
      setStep(0);
      setSelections([]);
    }
  }, [images, loading]);

  // "Restart Quiz" button resets quiz
  const handleRestart = () => {
    fetchCurated({ per_page: 18 });
    setReady(false);
  };

  // Handle duel vote
  const handleSelect = (side) => {
    setSelections((prev) => [...prev, side]);
    setStep((prev) => prev + 1);
  };

  // Compute summary after quiz
  const computeSummary = () => {
    // Tally which images were most picked (also, could analyze color palettes & themes here)
    const votes = duelPairs.map((pair, i) =>
      selections[i] === "left" ? pair[0] : pair[1]
    );
    // Find most repeated photographer or color
    const topPhotographer = (() => {
      const tally = {};
      for (const v of votes) {
        if (!v.photographer) continue;
        tally[v.photographer] = (tally[v.photographer] || 0) + 1;
      }
      return Object.entries(tally).sort((a, b) => b[1] - a[1])[0]?.[0];
    })();
    return { pickedImages: votes, topPhotographer };
  };

  // Done
  if (ready && step >= DUELS_PER_QUIZ) {
    const summary = computeSummary();
    return (
      <QuizResult
        summary={summary}
        onRestart={handleRestart}
        onFinish={() => onFinish && onFinish(summary)}
      />
    );
  }

  // Loading state
  if (!ready) {
    return (
      <div className="quiz-overlay">
        <div className="quiz-loader">
          <div className="loader-spinner"></div>
          <div>Loading beautiful visuals for you...</div>
        </div>
      </div>
    );
  }

  // Show duel
  const pair = duelPairs[step] || [];
  return (
    <div className="quiz-overlay">
      <div className="quiz-step">
        <div className="quiz-progress">
          Duel {step + 1} / {DUELS_PER_QUIZ}
        </div>
        <div className="duel-row">
          <DuelCard
            image={pair[0]}
            onSelect={() => handleSelect("left")}
            side="left"
          />
          <span className="duel-or">vs</span>
          <DuelCard
            image={pair[1]}
            onSelect={() => handleSelect("right")}
            side="right"
          />
        </div>
      </div>
    </div>
  );
}

// Renders a card with the duel image and overlays
function DuelCard({ image, onSelect, side }) {
  if (!image) return null;
  return (
    <div
      className={`duel-card duel-card-${side}`}
      onClick={onSelect}
      tabIndex={0}
      aria-label={`Pick this image (${side})`}
      style={{
        backgroundImage: `url(${image.src.large2x || image.src.large})`,
      }}
    >
      <div className="duel-gradient"></div>
      <div className="duel-info">
        <span className="duel-photog">by {image.photographer}</span>
      </div>
      <span className="duel-pick-btn">Pick</span>
    </div>
  );
}

// Results overlay at end of quiz
function QuizResult({ summary, onRestart, onFinish }) {
  return (
    <div className="quiz-overlay quiz-result">
      <h2 className="quiz-title">Your Visual Vibes!</h2>
      <div className="quiz-picked-list">
        {summary.pickedImages.map((img, i) => (
          <div className="quiz-picked-thumb" key={i}>
            <img
              src={img.src.medium}
              alt={`Picked ${i + 1}`}
              loading="lazy"
              style={{ borderRadius: "16px", width: "80px", height: "60px", objectFit: "cover" }}
            />
          </div>
        ))}
      </div>
      <div className="quiz-summary">
        <p>
          Most favored photographer:
          <span className="quiz-highlight">
            {" "}
            {summary.topPhotographer || "—"}
          </span>
        </p>
        <p>
          Your selections paint a unique vibe! Explore more or retry to refine
          your style.
        </p>
      </div>
      <div className="quiz-result-actions">
        <button className="quiz-action-btn" onClick={onRestart}>
          Restart Quiz
        </button>
        <button className="quiz-action-btn quiz-action-finish" onClick={onFinish}>
          Done
        </button>
      </div>
    </div>
  );
}

export default AestheticQuiz;
