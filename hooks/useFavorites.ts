"use client";

import { useEffect, useState } from "react";

export default function useFavorites() {
  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      if (typeof window === "undefined") return [];
      const raw = localStorage.getItem("favorites");
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem("favorites", JSON.stringify(favorites));
    } catch {
      // ignore
    }
  }, [favorites]);

  const isFavorite = (id: string) => favorites.includes(id);

  const toggleFavorite = (id: string) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  return { favorites, isFavorite, toggleFavorite, setFavorites };
}
