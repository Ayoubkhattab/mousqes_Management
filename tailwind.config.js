/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./features/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: { arabic: ["ui-sans-serif", "system-ui", "Arial"] },
    },
  },
  plugins: [require("tailwindcss-rtl")], // بدون ()
};
