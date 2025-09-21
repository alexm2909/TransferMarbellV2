import express from "express";
import cors from "cors";
import { handleDemo } from "./routes/demo";

export function createServer() {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Example API routes
  app.get("/api/ping", (_req, res) => {
    res.json({ message: "Hello from Express server v2!" });
  });

  app.get("/api/demo", handleDemo);
  // Send confirmation email (used after booking creation)
  app.post("/api/send-confirmation", async (req, res) => {
    const { handleSendConfirmation } = await import("./routes/sendConfirmation");
    return handleSendConfirmation(req, res);
  });

  // Bookings API
  app.post('/api/bookings', async (req, res) => {
    const { handleCreateBooking } = await import('./routes/bookings');
    return handleCreateBooking(req, res);
  });

  app.get('/api/vehicles', async (req, res) => {
    const { handleGetVehicles } = await import('./routes/bookings');
    return handleGetVehicles(req, res);
  });

  return app;
}
