/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
 
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      // declare 2 colors red-btn-bg and red-btn-hover
      colors: {
        "red-btn-bg": "#ef4444",
        "red-btn-hover": "#b91c1c",
        "blue-btn-hover": "#2064e4",
        'accept': '#059669',
        'reject': '#DC2626',
        'sidebar-link-hover': 'rgb(238, 239, 241)',
      },
      transitionProperty: {
        'all': 'width, margin, opacity',
      },
    },
  },
  plugins: [],
}

