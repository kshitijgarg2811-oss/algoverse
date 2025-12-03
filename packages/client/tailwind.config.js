/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                background: '#0a0a0f',
                surface: '#1a1a2e',
                primary: '#00f0ff',
                secondary: '#7000ff',
                accent: '#ff0055',
                text: '#e0e0e0',
                muted: '#a0a0b0'
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
                mono: ['Fira Code', 'monospace'],
            },
            animation: {
                'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
            }
        },
    },
    plugins: [],
}
