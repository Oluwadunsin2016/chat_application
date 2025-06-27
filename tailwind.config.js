// /** @type {import('tailwindcss').Config} */
// export default {
//   content: [
//     "./index.html",
//     "./src/**/*.{js,ts,jsx,tsx}",
//   ],
//   theme: {
//     extend: {},
//   },
//   plugins: [],
// }



// tailwind.config.js
import { heroui } from '@heroui/react';

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
   "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@heroui/react/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // animation: {
      //   'checkmark-first': 'checkmark-first 0.5s ease-out forwards',
      //   'checkmark-second': 'checkmark-second 0.5s ease-out 0.2s forwards',
      //   'particle': 'particle 1s ease-out forwards',
      // },
      // keyframes: {
      //   'checkmark-first': {
      //     '0%': { transform: 'scaleX(0) rotate(45deg)', opacity: 0 },
      //     '100%': { transform: 'scaleX(1) rotate(45deg)', opacity: 1 },
      //   },
      //   'checkmark-second': {
      //     '0%': { transform: 'scaleX(0) rotate(-45deg)', opacity: 0 },
      //     '100%': { transform: 'scaleX(1) rotate(-45deg)', opacity: 1 },
      //   },
      //   'particle': {
      //     '0%': { transform: 'translate(0, 0) scale(1)', opacity: 1 },
      //     '100%': { 
      //       transform: `translate(${Math.random() * 40 - 20}px, ${Math.random() * 40 - 20}px) scale(0)`, 
      //       opacity: 0 
      //     },
      //   },
      //   },
    },
  },
  // darkMode: "class",
  plugins: [heroui()],
};

