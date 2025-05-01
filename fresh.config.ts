import { defineConfig } from "$fresh/server.ts";
import tailwind from "$fresh/plugins/tailwind.ts";

export default defineConfig({
  plugins: [tailwind({
    theme: {
      extend: {
        colors: {
          primary: {
            DEFAULT: "#6b47ed",
            dark: "#5a3dd4",
          },
          error: "#dc2626",
          success: "#34d399",
        },
      },
    },
  })],
});