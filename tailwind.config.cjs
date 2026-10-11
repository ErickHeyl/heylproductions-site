/** @type {import('tailwindcss').Config} */
const defaultTheme = require("tailwindcss/defaultTheme");
module.exports = {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  theme: {
    extend: {
      colors: {
        // "Editorial Arch" palette (design J)
        paper: "#F7F3ED", // page background
        sand: "#EFE8DE", // alternate section background
        stone: "#E6DED2", // placeholders, video frames
        line: "#DDD5C9", // hairline borders
        ink: "#1C1A17", // body text
        muted: "#5E574E", // secondary text
        pine: {
          DEFAULT: "#24493D", // accent
          dark: "#1B382F", // accent hover
          mist: "#DCE6E0", // text on pine backgrounds
        },
      },
      fontFamily: {
        sans: ["Hanken Grotesk Variable", ...defaultTheme.fontFamily.sans],
        serif: ["Instrument Serif", ...defaultTheme.fontFamily.serif],
      },
      borderRadius: {
        // Arch-topped service cards
        arch: "999px 999px 16px 16px",
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
