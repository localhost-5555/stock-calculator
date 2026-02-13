// Import using the default export
import YahooFinance from "yahoo-finance2";

// Initialize it ONCE outside your fetch function
const yahoo = new YahooFinance();

const server = Bun.serve({
  port: 3000,
  async fetch(req) {
    const url = new URL(req.url);
    const symbol = url.searchParams.get("symbol");

    const headers = {
      'Access-Control-Allow-Origin': 'http://localhost:5173',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    };

    if (req.method === 'OPTIONS') return new Response(null, { headers });

    if (!symbol) {
      return Response.json({ error: "No symbol provided" }, { status: 400, headers });
    }

    try {
      // Use your initialized instance
      const results = await yahoo.quote(symbol);
      return Response.json(results, { headers });
    } catch (error) {
      console.error("Yahoo Finance Error:", error);
      return Response.json({ error: "Stock not found" }, { status: 404, headers });
    }
  },
});

console.log(`🚀 Server running at http://localhost:${server.port}`);