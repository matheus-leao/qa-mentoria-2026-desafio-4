import app from "../../../app.js";
import { config } from "dotenv";

export function getApp() {
  return process.env.baseUrl || "http://localhost:3000";
}
