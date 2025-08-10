// tailwind.config.ts (Updated)
import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'sidebar-bg': '#1A233A',
        'header-bg': '#1A233A', // Warna header utama
        'sidebar-text': '#FFFFFF',
        'sidebar-active-bg': '#FFFFFF',
        'sidebar-active-text': '#1A233A',
        'content-bg': '#F8F9FA', // Background lebih terang/putih keabuan
        'filter-bar-bg': '#2C3A57', // Warna filter bar yang sedikit lebih terang dari sidebar
        'button-blue': '#0D6EFD', // Warna biru solid untuk tombol download
        'success-green': '#198754',
        'danger-red': '#DC3545',
      },
      fontFamily: {
        sans: ['Poppins', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
export default config