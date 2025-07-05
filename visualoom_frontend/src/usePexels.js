/**
 * usePexels - React hook for accessing the Pexels API for curated images and searches.
 *
 * This hook abstracts secure image fetching for the inspiration gallery and moodboard features.
 * The API key is read from process.env.REACT_APP_PEXELS_API_KEY and never hardcoded.
 * Requires setting REACT_APP_PEXELS_API_KEY in your .env file.
 *
 * Example usage:
 *   const { images, loading, error, fetchCurated } = usePexels();
 *   useEffect(() => { fetchCurated({ per_page: 12 }); }, []);
 */

import { useState } from "react";

const PEXELS_BASE_URL = "https://api.pexels.com/v1";

function getPexelsKey() {
  // PUBLIC_INTERFACE
  /** 
   * Returns the Pexels API key from environment variable.
   * Throws if not defined (build error).
   */
  const key = process.env.REACT_APP_PEXELS_API_KEY;
  if (!key) {
    throw new Error("Pexels API Key is missing. Add REACT_APP_PEXELS_API_KEY to your .env file.");
  }
  return key;
}

// PUBLIC_INTERFACE
export function usePexels() {
  /**
   * React hook to facilitate calls to the Pexels API.
   * Returns { images, loading, error, fetchCurated, searchImages }
   */
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // PUBLIC_INTERFACE
  async function fetchCurated({ per_page = 16, page = 1 } = {}) {
    /**
     * Fetches curated photos from the Pexels API.
     * @param {Object} options Options for per_page, page
     */
    setLoading(true);
    setError(null);
    try {
      const key = getPexelsKey();
      const res = await fetch(`${PEXELS_BASE_URL}/curated?per_page=${per_page}&page=${page}`, {
        headers: { Authorization: key },
      });
      if (!res.ok) throw new Error("Failed to fetch curated images");
      const data = await res.json();
      setImages(data.photos || []);
    } catch (err) {
      setError(err);
      setImages([]);
    } finally {
      setLoading(false);
    }
  }

  // PUBLIC_INTERFACE
  async function searchImages(query, { per_page = 16, page = 1 } = {}) {
    /**
     * Searches photos from Pexels API.
     * @param {string} query Search term(s)
     * @param {Object} options Options for per_page, page
     */
    setLoading(true);
    setError(null);
    try {
      const key = getPexelsKey();
      const res = await fetch(`${PEXELS_BASE_URL}/search?query=${encodeURIComponent(query)}&per_page=${per_page}&page=${page}`, {
        headers: { Authorization: key },
      });
      if (!res.ok) throw new Error("Failed to search images");
      const data = await res.json();
      setImages(data.photos || []);
    } catch (err) {
      setError(err);
      setImages([]);
    } finally {
      setLoading(false);
    }
  }

  return { images, loading, error, fetchCurated, searchImages };
}
