import { mastra } from "../../mastra.config";

// Create Mastra server instance
export const server = mastra.getServer({
  port: process.env.PORT ? parseInt(process.env.PORT) : 3001,
  host: process.env.HOST || "localhost",
});

// Start the server
if (process.env.NODE_ENV !== "test") {
  server.start().then(() => {
    console.log("🚀 Mastra server started successfully!");
    console.log(`📡 Server running on ${server.host}:${server.port}`);
  });
}

export default server;
