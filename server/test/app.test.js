import assert from "node:assert/strict";
import test from "node:test";
import { createApp } from "../app.js";

function listen(app) {
  return new Promise((resolve) => {
    const server = app.listen(0, "127.0.0.1", () => {
      const { port } = server.address();
      resolve({ server, url: `http://127.0.0.1:${port}` });
    });
  });
}

function close(server) {
  return new Promise((resolve, reject) => {
    server.close((error) => (error ? reject(error) : resolve()));
  });
}

test("database health endpoint returns 200 after a successful test query", async () => {
  const app = createApp({
    clientOrigin: "http://localhost:5173",
    databaseHealthCheck: async () => ({
      connected: true,
      serverTime: new Date("2026-07-10T12:00:00.000Z"),
      latencyMs: 4,
    }),
  });
  const { server, url } = await listen(app);

  try {
    const response = await fetch(`${url}/api/health/database`);
    const body = await response.json();

    assert.equal(response.status, 200);
    assert.deepEqual(body, {
      status: "ok",
      database: "connected",
      databaseTime: "2026-07-10T12:00:00.000Z",
      latencyMs: 4,
    });
  } finally {
    await close(server);
  }
});

test("database health endpoint returns a generic 503 response on failure", async () => {
  const logMessages = [];
  const app = createApp({
    clientOrigin: "http://localhost:5173",
    databaseHealthCheck: async () => {
      throw new Error(
        "Could not connect to postgresql://private-user:private-password@localhost/spotmtl",
      );
    },
    logger: {
      error(message) {
        logMessages.push(message);
      },
    },
  });
  const { server, url } = await listen(app);

  try {
    const response = await fetch(`${url}/api/health/database`);
    const body = await response.json();

    assert.equal(response.status, 503);
    assert.deepEqual(body, {
      status: "error",
      database: "unavailable",
    });
    assert.doesNotMatch(JSON.stringify(body), /private-user|private-password/);
    assert.match(logMessages[0], /postgresql:\/\/\[REDACTED\]@localhost/);
  } finally {
    await close(server);
  }
});
