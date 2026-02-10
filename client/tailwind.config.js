/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        churchBlue: "#0D1117",
        accentBlue: "#8EACCD",
        churchGold: "#FFD700",
        // Your Custom Admin Palette
        admin: {
          jet: "#29343F", // Accents in Light
          space: "#002034", // Sidebar in Dark
          charcoal: "#283E51", // Borders/Subtext
          prussian: "#001D30", // Secondary Dark
          ink: "#000411", // Background in Dark
        },
      },
      fontFamily: {
        // Bold typography for Admin
        admin: ['"Archivo Black"', "sans-serif"],
        body: ["Inter", "sans-serif"],
      },
    },
  },
  plugins: [],
};
