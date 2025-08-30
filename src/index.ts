import { handleRequest } from "./server.js";

const server = Bun.serve({
  port: 3000,
  async fetch(request) {
    try {
      const authHeader = request.headers.get("authorization");
      const result = await handleRequest(authHeader);

      return new Response(JSON.stringify(result), {
        headers: { "Content-Type": "application/json" },
      });
    } catch (error) {
      console.error("Request error:", error);
      return new Response(
        JSON.stringify({
          message: "Internal server error",
        }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        }
      );
    }
  },
});

console.log(`Server is running on port ${server.port}`);
