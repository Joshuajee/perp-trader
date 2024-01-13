/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary_1: "#0F1035",
        primary_2: "#365486",
        primary_3: "#151de8",
        primary_4: "#1c1d45",
        primary_5: "#202257",
        secondary_1: "#7FC7D9",
        secondary_2: "#DCF2F1",
        secondary_3: "#4a638c",
      },
    },
  },
  plugins: [],
};
