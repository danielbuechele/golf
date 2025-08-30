import type { VercelRequest, VercelResponse } from "@vercel/node";
import { handleRequest } from "../src/server.js";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const result = await handleRequest(req.headers.authorization);
    res.json(result);
  } catch (error) {
    console.error("Request error:", error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
}