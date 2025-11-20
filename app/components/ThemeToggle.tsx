"use client";

import { useTheme } from "@/app/ThemeContext";

export default function ThemeToggle() {
  const { isDark, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="theme-toggle"
      title={isDark ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
      style={{
        position: "fixed",
        bottom: "2rem",
        right: "2rem",
        width: "3rem",
        height: "3rem",
        borderRadius: "50%",
        border: "none",
        background: "var(--accent-purple)",
        color: "white",
        fontSize: "1.5rem",
        cursor: "pointer",
        zIndex: 1000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        transition: "all 0.3s ease",
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.2)",
      }}
      onMouseEnter={(e) => {
        const target = e.target as HTMLButtonElement;
        target.style.background = "var(--accent-light)";
        target.style.transform = "scale(1.1)";
      }}
      onMouseLeave={(e) => {
        const target = e.target as HTMLButtonElement;
        target.style.background = "var(--accent-purple)";
        target.style.transform = "scale(1)";
      }}
    >
      {isDark ? "☀️" : "🌙"}
    </button>
  );
}
