import React, { useEffect, useState } from "react";
import { usePexels } from "./usePexels";

/**
 * PUBLIC_INTERFACE
 * InspirationGallery
 * Curated inspiration/image gallery with category/tag filter,
 * async loading, and playful modal preview. Pexels-powered.
 * Modern, immersive, playful KAVIA style.
 * 
 * @param {Object} props
 * @param {boolean} [props.asModal] - If true, renders as fullscreen overlay modal.
 * @param {function} [props.onClose] - Optional close callback, only if asModal.
 */

const CATEGORIES = [
  { name: "All", query: "" },
  { name: "Nature", query: "nature" },
  { name: "Abstract", query: "abstract, pattern" },
  { name: "Urban", query: "city, urban" },
  { name: "Pastel", query: "pastel colors" },
  { name: "Bold", query: "vivid, bold, pop art" },
  { name: "Minimal", query: "minimalism" },
  { name: "People", query: "portrait, people" },
  { name: "Dreamy", query: "dreamy, magical" },
];

function InspirationGallery({ asModal = false, onClose }) {
  const { images, loading, error, fetchCurated, searchImages } = usePexels();
  const [selectedCat, setSelectedCat] = useState(CATEGORIES[0].name);
  const [modalPhoto, setModalPhoto] = useState(null);
  const [page, setPage] = useState(1);

  // On mount or category change: fetch
  useEffect(() => {
    setPage(1);
    if (selectedCat === "All" || !CATEGORIES.find((c) => c.name === selectedCat)?.query) {
      fetchCurated({ per_page: 12 });
    } else {
      searchImages(CATEGORIES.find((c) => c.name === selectedCat).query, { per_page: 12 });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCat]);

  // Handler to load more (pagination, async)
  const handleLoadMore = async () => {
    const newPage = page + 1;
    setPage(newPage);
    if (selectedCat === "All" || !CATEGORIES.find((c) => c.name === selectedCat)?.query) {
      await fetchCurated({ per_page: 12, page: newPage });
    } else {
      await searchImages(CATEGORIES.find((c) => c.name === selectedCat).query, {
        per_page: 12, page: newPage
      });
    }
  };

  // Combined playful modal overlay for preview
  function PhotoModal({ photo, onClose }) {
    if (!photo) return null;
    return (
      <div
        className="gallery-modal-overlay"
        tabIndex={0}
        onClick={onClose}
        style={{
          position: "fixed", left: 0, right: 0, top: 0, bottom: 0,
          background: "rgba(44, 18, 61, 0.91)",
          zIndex: 1700, display: "flex", alignItems: "center", justifyContent: "center",
        }}
      >
        <div
          className="gallery-modal-content"
          style={{
            background: "#fff",
            borderRadius: "38px",
            maxWidth: 680,
            width: "90vw",
            padding: "32px 22px",
            boxShadow: "0 6px 32px #e1b0fa44, 0 1.5px 6px #4d0060aa",
            position: "relative",
            display: "flex",
            flexDirection: "column",
            alignItems: "center"
          }}
          onClick={e => e.stopPropagation()}
        >
          <button
            aria-label="Close Preview"
            onClick={onClose}
            style={{
              position: "absolute", top: 22, right: 24,
              background: "#ff70ae", color: "#fff",
              border: "none", borderRadius: "22px",
              fontWeight: "bold", fontSize: "1.23rem",
              padding: "4px 19px", boxShadow: "0 1px 8px #79024144", cursor: "pointer"
            }}
          >✕</button>
          <img
            src={photo?.src?.large2x || photo?.src?.large}
            alt={photo?.alt || "Inspiration Preview"}
            loading="eager"
            style={{
              maxWidth: "510px", width: "98%",
              borderRadius: "23px",
              boxShadow: "0 1.5px 10px #ff70ae44",
              marginBottom: 17
            }}
          />
          <div style={{
            color: "#790241",
            fontWeight: 700,
            fontSize: "1.13rem",
            marginBottom: 5,
          }}>
            {photo?.alt || "Inspiration"}
          </div>
          <div style={{
            fontStyle: "italic", color: "#a66164", fontSize: ".98rem", opacity: 0.8
          }}>
            Photo by {photo?.photographer}
          </div>
        </div>
      </div>
    );
  }

  // Playful category strip header
  function CategoryFilters() {
    return (
      <div className="gallery-categories" style={{
        display: "flex", gap: "13px", marginBottom: 26, flexWrap: "wrap", justifyContent: "center"
      }}>
        {CATEGORIES.map(cat => (
          <button
            className={`gallery-cat-btn${cat.name === selectedCat ? " active" : ""}`}
            key={cat.name}
            onClick={() => setSelectedCat(cat.name)}
            style={{
              fontWeight: cat.name === selectedCat ? 700 : 500,
              color: cat.name === selectedCat ? "#fff" : "#ff70ae",
              background: cat.name === selectedCat ? "linear-gradient(90deg,#ff70ae,#790241)" : "#FCFCFC",
              border: cat.name === selectedCat ? "2.3px solid #790241" : "2px solid #ff70ae22",
              borderRadius: "24px",
              padding: "6px 22px",
              boxShadow: cat.name === selectedCat ? "0 3px 8px #ff70ae44" : "0 0.5px 3px #79024114",
              cursor: "pointer",
              transition: "all .17s"
            }}
            aria-pressed={cat.name === selectedCat}
          >
            {cat.name}
          </button>
        ))}
      </div>
    );
  }

  // Gallery main grid rendering
  function GalleryGrid() {
    if (loading)
      return (
        <div className="gallery-loader">
          <div className="loader-spinner"></div>
          <div>Loading inspiration...</div>
        </div>
      );
    if (error)
      return (
        <div
          style={{
            color: "#790241",
            textAlign: "center", fontWeight: 700, background: "#fffcee", borderRadius: "14px", padding: "18px"
          }}
        >Failed to load images. Please check your internet or API key.</div>
      );
    if (!images || images.length === 0)
      return (
        <div
          style={{
            color: "#ff70ae", textAlign: "center", fontWeight: 600, margin: "40px 0"
          }}
        >No inspiration found for this category.</div>
      );

    return (
      <div className="gallery-grid" style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
        gap: "23px 16px",
        width: "100%",
        marginBottom: "24px"
      }}>
        {images.map(img => (
          <div
            className="gallery-grid-img-card"
            key={img.id}
            tabIndex={0}
            role="button"
            aria-label="Open inspiration preview"
            style={{
              background: "#fff",
              borderRadius: "20px",
              boxShadow: "0 2px 7px #ff70ae22, 0 1px 1.5px #79024115",
              position: "relative",
              cursor: "pointer",
              overflow: "hidden",
              outline: "2px solid transparent",
              transition: "transform 0.15s cubic-bezier(.36,.76,.4,1.18), box-shadow 0.18s"
            }}
            onClick={() => setModalPhoto(img)}
            onKeyDown={e => {
              if (e.key === "Enter" || e.key === " ") setModalPhoto(img);
            }}
          >
            <img
              src={img.src.medium}
              alt={img.alt || "inspiration"}
              style={{
                width: "100%",
                height: "152px",
                objectFit: "cover",
                borderRadius: "20px 20px 7px 7px",
                display: "block"
              }}
              loading="lazy"
            />
            <div style={{
              position: "absolute", left: 0, right: 0, bottom: 0,
              background: "linear-gradient(0deg,#790241cc 80%,#fcfcfc11 100%)",
              color: "#fff",
              fontWeight: 700,
              fontSize: "1rem",
              padding: "9px 15px 13px 13px",
              textShadow: "2px 2px 10px #35002188",
              borderRadius: "0 0 18px 18px",
              zIndex: 2,
              minHeight: 35,
            }}>
              {img.photographer}
            </div>
          </div>
        ))}
      </div>
    );
  }

  const mainContent = (
    <div
      className="inspiration-gallery-root"
      style={{
        padding: asModal ? "33px 0 18px" : "39px 0 38px",
        background: asModal ? "rgba(252,252,252, 0.99)" : "none",
        minHeight: asModal ? "100vh" : undefined,
        borderRadius: asModal ? "48px" : undefined,
        maxWidth: 1100,
        margin: "0 auto",
        position: "relative"
      }}
    >
      <h2
        className="gallery-title"
        style={{
          textAlign: "center",
          color: "#ff70ae",
          fontSize: "2.07rem",
          marginBottom: "12px",
          fontWeight: 800,
          letterSpacing: ".027em"
        }}>
        🌈 Inspiration Gallery
      </h2>
      <div className="gallery-description" style={{
        color: "#790241",
        textAlign: "center",
        marginBottom: "17px",
        fontWeight: 500,
        fontSize: "1.12rem"
      }}>
        Explore curated, category-filtered visuals! Click an image to view details.<br />
        All photos via Pexels API.
      </div>
      <CategoryFilters />
      <GalleryGrid />
      <div style={{ display: "flex", justifyContent: "center", marginTop: 7 }}>
        <button
          className="gallery-loadmore-btn"
          style={{
            padding: "8px 29px",
            borderRadius: "22px",
            background: "linear-gradient(90deg,#ff70ae,#790241)",
            color: "#fff",
            fontWeight: 700,
            fontSize: "1.05rem",
            border: "none",
            boxShadow: "0 2px 10px #ff70ae23",
            marginTop: "1px",
            cursor: "pointer"
          }}
          onClick={handleLoadMore}
          disabled={loading}
        >
          {loading ? "Loading..." : "Show More"}
        </button>
      </div>
      {modalPhoto && <PhotoModal photo={modalPhoto} onClose={() => setModalPhoto(null)} />}
    </div>
  );

  if (asModal) {
    return (
      <div
        className="gallery-modal-main"
        style={{
          position: "fixed", left: 0, right: 0, top: 0, bottom: 0, zIndex: 1600,
          background: "rgba(252,252,252,0.97)", overflowY: "auto"
        }}
      >
        <button
          aria-label="Close Inspiration Gallery"
          onClick={onClose}
          style={{
            position: "absolute", top: 28, right: 40, zIndex: 1550,
            background: "#790241", color: "#fff",
            border: "none",
            borderRadius: "22px",
            fontWeight: "bold",
            fontSize: "1.22rem",
            padding: "6px 18px",
            boxShadow: "0 1px 9px #79024123",
            cursor: "pointer"
          }}
        >✕</button>
        {mainContent}
      </div>
    );
  }
  return mainContent;
}

export default InspirationGallery;
