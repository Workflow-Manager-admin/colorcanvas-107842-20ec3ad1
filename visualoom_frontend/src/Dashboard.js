import React, { useEffect, useState } from "react";
import { supabase } from "./supabaseClient";
import "./Dashboard.css";

// PUBLIC_INTERFACE
/**
 * Renders the user dashboard with saved palettes and inspiration images.
 * Modern, playful style with section cards for palettes and images.
 */
function Dashboard({ user }) {
  const [palettes, setPalettes] = useState([]);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch saved palettes and images for user from Supabase
  useEffect(() => {
    async function fetchSaves() {
      setLoading(true);
      // Replace with auth user id (if user null, shows demo saves)
      const user_id = user?.id || "demo-user";
      // Palettes
      let { data: pals } = await supabase
        .from("saved_palettes")
        .select("*")
        .eq("user_id", user_id)
        .order("saved_at", { ascending: false });
      // Images
      let { data: imgs } = await supabase
        .from("saved_images")
        .select("*")
        .eq("user_id", user_id)
        .order("saved_at", { ascending: false });
      setPalettes(pals || []);
      setImages(imgs || []);
      setLoading(false);
    }
    fetchSaves();
  }, [user]);

  return (
    <div className="dashboard-main">
      <h1 className="dashboard-title">My Loom Dashboard</h1>
      <div className="dashboard-section-cards">
        <DashboardSection title="🎨 Saved Palettes" loading={loading}>
          {palettes.length === 0 && !loading && (
            <div className="dashboard-empty">No palettes saved yet!</div>
          )}
          <div className="dashboard-palettes-list">
            {palettes.map((item) => (
              <PaletteCard palette={item.palette} key={item.id} name={item.name} />
            ))}
          </div>
        </DashboardSection>
        <DashboardSection title="🖼️ Saved Images" loading={loading}>
          {images.length === 0 && !loading && (
            <div className="dashboard-empty">No images saved yet!</div>
          )}
          <div className="dashboard-images-list">
            {images.map((item) => (
              <ImageCard image={item.image_url} key={item.id} photographer={item.photographer} />
            ))}
          </div>
        </DashboardSection>
      </div>
    </div>
  );
}

/** Card wrapper for section */
function DashboardSection({ title, children, loading }) {
  return (
    <section className="dashboard-section">
      <h2 className="dashboard-section-title">{title}</h2>
      {loading ? (
        <div className="dashboard-loading">Loading...</div>
      ) : (
        children
      )}
    </section>
  );
}

/** Palette card element */
function PaletteCard({ palette, name }) {
  let colors = [];
  try {
    if (typeof palette === "string") colors = JSON.parse(palette);
    else colors = palette;
  } catch {
    colors = [];
  }
  return (
    <div className="dashboard-palette-card" title={typeof name === "string" ? name : ""}>
      <div className="dashboard-palette-swatches">
        {colors &&
          Array.isArray(colors) &&
          colors.map(
            (col) =>
              typeof col === "string" && (
                <span
                  key={col}
                  className="dashboard-palette-swatch"
                  style={{ background: col }}
                  title={col}
                />
              )
          )}
      </div>
      <div className="dashboard-palette-hexes">
        {colors &&
          Array.isArray(colors) &&
          colors.map(
            (col) =>
              typeof col === "string" && (
                <span key={col} className="dashboard-palette-hex">
                  {col}
                </span>
              )
          )}
      </div>
      {name && <div className="dashboard-palette-name">{name}</div>}
    </div>
  );
}

/** Image card element */
function ImageCard({ image, photographer }) {
  return (
    <div className="dashboard-image-card">
      <img
        src={image}
        alt="Saved Inspiration"
        className="dashboard-image-img"
        loading="lazy"
      />
      <div className="dashboard-image-photog">
        {photographer && <span>By {photographer}</span>}
      </div>
    </div>
  );
}

export default Dashboard;
