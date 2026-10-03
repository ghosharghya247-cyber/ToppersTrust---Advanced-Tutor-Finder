const assert = require("node:assert/strict");

process.env.FRONTEND_URL =
  "https://toppers-trust-advanced-tutor-finder.vercel.app/tutor-dashboard";

const app = require("../api/index");

async function main() {
  const server = app.listen(0);
  await new Promise((resolve) => server.once("listening", resolve));

  try {
    const { port } = server.address();
    const baseUrl = `http://127.0.0.1:${port}`;
    const cases = [
      ["cancel", "cancelled"],
      ["fail", "failed"],
      ["success", "error"],
    ];

    for (const [callback, status] of cases) {
      const response = await fetch(`${baseUrl}/api/payment/${callback}`, {
        method: "POST",
        redirect: "manual",
        headers: { "content-type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          value_b:
            "https://toppers-trust-advanced-tutor-finder.vercel.app/tutor-dashboard",
        }),
      });

      assert.equal(response.status, 302);
      assert.equal(
        response.headers.get("location"),
        `https://toppers-trust-advanced-tutor-finder.vercel.app/tutor-dashboard?payment=${status}`,
      );
    }

    console.log("PASS: payment callbacks return to the tutor dashboard.");
  } finally {
    await new Promise((resolve, reject) =>
      server.close((error) => (error ? reject(error) : resolve())),
    );
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
