import assert from "node:assert/strict";
import test from "node:test";
import {
  getCurrentAccount,
  loginAccount,
  logoutAccount,
  registerAccount,
} from "./auth.js";

function jsonResponse(body, status = 200) {
  return new Response(JSON.stringify(body), {
    headers: { "Content-Type": "application/json" },
    status,
  });
}

test("the browser auth client sends only server-approved fields", async () => {
  const originalFetch = globalThis.fetch;
  const requests = [];

  globalThis.fetch = async (url, options) => {
    requests.push({ options, url });

    if (url.endsWith("/auth/logout")) {
      return new Response(null, { status: 204 });
    }

    return jsonResponse({
      user: {
        id: "user-id",
        name: "Test User",
        email: "test@example.com",
        role: "user",
      },
    });
  };

  try {
    await registerAccount({
      name: " Test User ",
      email: " TEST@Example.COM ",
      password: "correct horse battery staple",
      role: "administrator",
      isAdmin: true,
    });
    await loginAccount({
      email: " TEST@Example.COM ",
      password: "correct horse battery staple",
      role: "administrator",
      isAdmin: true,
    });
    await getCurrentAccount();
    await logoutAccount();
  } finally {
    globalThis.fetch = originalFetch;
  }

  assert.deepEqual(JSON.parse(requests[0].options.body), {
    name: "Test User",
    email: "test@example.com",
    password: "correct horse battery staple",
  });
  assert.deepEqual(JSON.parse(requests[1].options.body), {
    email: "test@example.com",
    password: "correct horse battery staple",
  });
  assert.equal(requests[2].options.body, undefined);
  assert.equal(requests[3].options.body, undefined);

  for (const { options } of requests) {
    assert.equal(options.credentials, "include");
  }

  assert.equal(requests[0].options.headers["X-SpotMTL-Request"], "1");
  assert.equal(requests[1].options.headers["X-SpotMTL-Request"], "1");
  assert.equal(requests[2].options.headers["X-SpotMTL-Request"], undefined);
  assert.equal(requests[3].options.headers["X-SpotMTL-Request"], "1");
});
