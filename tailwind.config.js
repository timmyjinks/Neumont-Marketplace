// tailwind.config.js
module.exports = {
    content: [
      "./app/**/*.{js,ts,jsx,tsx}", // adjust paths if needed
      "./pages/**/*.{js,ts,jsx,tsx}",
      "./components/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
      extend: {
        colors: {
          gold: "#FEDC04",
        },
      },
    },
    plugins: [],
  };
  