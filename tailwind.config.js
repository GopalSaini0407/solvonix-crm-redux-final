export default {
    content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
    theme: {
      extend: {
        keyframes: {
          scaleIn: {
            "0%": { transform: "scale(0.95)", opacity: 0 },
            "100%": { transform: "scale(1)", opacity: 1 },
          },
        },
        animation: {
          scaleIn: "scaleIn 0.2s ease-out",
        },
        colors: {
          bg: "var(--color-bg)",
          text: "var(--color-text)",
          surface: "var(--color-surface)",
          primary: "var(--color-primary)",
        },
      },
    },
  };
  