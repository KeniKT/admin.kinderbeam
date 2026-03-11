/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "dark-blue": "#1E3A5F",
        "light-blue": "#00A3FF",
        "cream": "#F2EAE6",
        "light-cream": "#FAF7F5",
        "medium-cream": "#CAA897",
        "dark-cream": "#A07060",
      },
    },
  },
  plugins: [],
};