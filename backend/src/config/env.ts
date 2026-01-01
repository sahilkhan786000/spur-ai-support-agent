import dotenv from "dotenv";
dotenv.config();

export const env = {
  PORT: process.env.PORT || 3000,
  HF_API_KEY: process.env.HF_API_KEY!,
  HF_MODEL: process.env.HF_MODEL!,
};
