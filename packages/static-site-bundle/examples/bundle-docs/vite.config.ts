import Symfony from "@symfony/reprise/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";

export default defineConfig({
  input: { app: "./assets/main.css", highlight: "./assets/highlight.js" },
  plugins: [
    Symfony({ outputPath: "public/build", publicPath: "/build/" }),
    tailwindcss(),
  ],
});
