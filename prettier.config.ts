import { type Config } from "prettier";

const config: Config = {
  plugins: [
    "@trivago/prettier-plugin-sort-imports",
    "prettier-plugin-tailwindcss",
  ],
  importOrderParserPlugins: ["typescript", "jsx"],
};

export default config;
