// tailwind.config.js

module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "system-ui", "-apple-system", "Segoe UI", "sans-serif"],
      },
      colors: {
        ink: "#1A1A18",
        paper: "#F7F6F3",
        surface: "#FFFFFF",
        muted: "#6E6D66",
        line: "#E8E6DF",
        accent: "#0F6E4C",
        "accent-dark": "#0B5A3E",
        "accent-soft": "#E4F0EA",
      },
      boxShadow: {
        lift: "0 8px 24px rgba(26, 26, 24, 0.06)",
      },
    },
  },
  plugins: [],
};