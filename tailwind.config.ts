import { type Config } from "tailwindcss";

export default {
  content: [
    "{routes,islands,components}/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#6b47ed",
          dark: "#5a3dd4",
        },
        error: {
          DEFAULT: "#dc2626",
          bg: "#fee2e2",
        },
        success: {
          DEFAULT: "#34d399",
          bg: "#ecfdf5",
        },
      },
    },
  },
} satisfies Config;