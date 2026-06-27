/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        azul: {
          cabecera: '#4DA0EC',
          medio: '#7CBDF2',
          claro: '#B6DBF9',
          suave: '#E4F2FC',
          btn: '#2E8BE0',
          accent: '#1F6FC4',
          marino: '#0B335E',
          secundario: '#5A6B85',
          fondo: '#F4F9FE',
          borde: '#E6EEF6',
        },
        urgente: '#E8112D',
        abierto: {
          texto: '#0F9D63',
          fondo: '#DEF5EB',
          punto: '#13B473',
        },
        cerrado: {
          texto: '#8A98AB',
          fondo: '#E9EEF3',
        },
      },
    },
  },
  plugins: [],
}
