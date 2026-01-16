module.exports = {
  darkMode: "class", // <- pastikan ini ada
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",      // <--- Tambahkan ini (penting!)
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",    // <--- Tambahkan ini (jika ada folder pages)
    "./components/**/*.{js,ts,jsx,tsx,mdx}", // <--- Tambahkan ini (jika folder components di root)
    "./src/**/*.{js,ts,jsx,tsx,mdx}",      // (Opsional, biarkan jika nanti mau pakai src)
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
