// tailwind.config.js
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        accent: "#9333ea",
        brand: {
          DEFAULT: "#2563eb",
          dark: "#1e40af",
        },
        card: "#1e293b",
      },
    },
  },
  plugins: [],
};
