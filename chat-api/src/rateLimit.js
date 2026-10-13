const hits = new Map();

/**
 * Simple in-memory IP rate limiter for Hostinger single-instance deploys.
 */
export function createRateLimiter({ windowMs = 60_000, max = 20 } = {}) {
  return function rateLimit(req, res, next) {
    const ip =
      req.headers["x-forwarded-for"]?.toString().split(",")[0].trim() ||
      req.socket?.remoteAddress ||
      "unknown";
    const now = Date.now();
    let bucket = hits.get(ip);
    if (!bucket || now - bucket.start >= windowMs) {
      bucket = { start: now, count: 0 };
      hits.set(ip, bucket);
    }
    bucket.count += 1;
    if (bucket.count > max) {
      res.status(429).json({
        error: "Too many requests. Please wait a moment and try again.",
      });
      return;
    }
    next();
  };
}
