import express, { type Express, type Request, type Response, type NextFunction } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import pinoHttp from "pino-http";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import router from "./routes";
import { logger } from "./lib/logger";
import { authMiddleware } from "./middlewares/authMiddleware";

const app: Express = express();

// Security: Helmet sets safe default HTTP headers (X-Frame-Options, X-Content-Type-Options, etc.)
app.use(
  helmet({
    // Allow inline scripts needed by the Vite dev banner in development
    contentSecurityPolicy: process.env["NODE_ENV"] === "production",
  }),
);

// Rate limiting: 200 requests per minute per IP across all API routes
const limiter = rateLimit({
  windowMs: 60 * 1000,
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many requests. Please try again later." },
});
app.use(limiter);

app.use(
  pinoHttp({
    logger,
    serializers: {
      req(req) {
        return {
          id: req.id,
          method: req.method,
          url: req.url?.split("?")[0],
        };
      },
      res(res) {
        return {
          statusCode: res.statusCode,
        };
      },
    },
  }),
);

// CORS: In production, lock down to the known domain; in dev allow the Replit preview origin
const allowedOrigin = process.env["NODE_ENV"] === "production"
  ? ["https://premierlogisticsltds.com", "https://www.premierlogisticsltds.com"]
  : true;
app.use(cors({ credentials: true, origin: allowedOrigin }));

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(authMiddleware);

app.use("/api", router);

// Global error handler — never leak stack traces to clients
app.use((err: unknown, _req: Request, res: Response, _next: NextFunction) => {
  const message = err instanceof Error ? err.message : "Internal server error";
  logger.error({ err }, "Unhandled error");
  res.status(500).json({ error: message });
});

export default app;
