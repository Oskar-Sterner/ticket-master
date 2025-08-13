import { defineConfig } from "cypress";
import dotenv from "dotenv";

dotenv.config();

export default defineConfig({
  e2e: {
    baseUrl: `http://localhost:${process.env.PORT || 3001}/api`,
    supportFile: false,
    setupNodeEvents(on, config) {},
  },
});
