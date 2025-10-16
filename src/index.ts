import { Hono } from "hono";
import { sign, verify } from "hono/jwt";

const app = new Hono<{ Bindings: CloudflareBindings }>();

// POST /token - Create JWT token
app.post("/token", async (c) => {
  try {
    // Sign the token using JWK with RS256 algorithm
    const token = await sign({ "uid": "123456" }, JSON.parse(c.env.JWK_PRIVATE_KEY), "RS256");

    return c.json({ token });
  } catch (error) {
    console.error(error);
    return c.json({ error: "Invalid request body" }, 400);
  }
});

// POST /secure - Validate JWT token and output clientId and clientSecret
app.post("/secure", async (c) => {
  try {
    // Get token from Authorization header
    const authHeader = c.req.header("Authorization");
    
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return c.json({ error: "Missing or invalid Authorization header" }, 401);
    }
    
    const token = authHeader.substring(7); // Remove "Bearer " prefix
    // Verify and decode the token using JWK with RS256 algorithm
    const payload = await verify(token, JSON.parse(c.env.JWK_PUBLIC_KEY), "RS256");
    
    const { clientId, clientSecret } = await c.req.json();

    // Return clientId and clientSecret from token
    return c.json({
      clientId,
      clientSecret,
      uid: payload.uid,
    });
  } catch (error) {
    console.error(error);
    return c.json({ error: "Invalid or expired token" }, 401);
  }
});

app.get("/", (c) => {
  return c.text("Hello Hono!");
});

export default app;
