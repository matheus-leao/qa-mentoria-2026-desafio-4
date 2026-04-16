import app from "../../../app.js";
import { config } from "dotenv";

export function getApp() {
  return process.env.baseUrl;
}
