import { expect, test } from "@playwright/test";

test.describe("Local API (vite preview middleware)", () => {
  test("GET /api/public/site-content", async ({ request }) => {
    const res = await request.get("/api/public/site-content");
    expect(res.ok()).toBeTruthy();
    const data = (await res.json()) as { ok?: boolean; siteMetricConfig?: unknown };
    expect(data.ok).toBe(true);
    expect(data.siteMetricConfig).toBeTruthy();
  });

  test("GET /api/public/referral-partner (no ref)", async ({ request }) => {
    const res = await request.get("/api/public/referral-partner");
    expect(res.ok()).toBeTruthy();
    const data = (await res.json()) as { ok?: boolean; found?: boolean };
    expect(data.ok).toBe(true);
    expect(data.found).toBe(false);
  });

  test("POST /api/public/referral-track", async ({ request }) => {
    const res = await request.post("/api/public/referral-track", {
      data: { event: "landing", referralCode: "" },
    });
    expect(res.ok()).toBeTruthy();
    const data = (await res.json()) as { ok?: boolean };
    expect(data.ok).toBe(true);
  });

  test("POST /api/readiness/score + unlock", async ({ request }) => {
    const scoreRes = await request.post("/api/readiness/score", {
      headers: { "Content-Type": "application/json" },
      data: {
        answers: {},
        clientScore: 0,
        clientTier: "",
        clientZone: "",
      },
    });
    expect(scoreRes.ok()).toBeTruthy();
    const score = (await scoreRes.json()) as { assessmentId?: string; verified?: { score: number } };
    expect(score.assessmentId).toBeTruthy();
    expect(typeof score.verified?.score).toBe("number");

    const unlockRes = await request.post("/api/readiness/unlock", {
      headers: { "Content-Type": "application/json" },
      data: { assessmentId: score.assessmentId, email: "e2e@example.com" },
    });
    expect(unlockRes.ok()).toBeTruthy();
    const unlock = (await unlockRes.json()) as { success?: boolean };
    expect(unlock.success).toBe(true);
  });

  test("POST /api/intake/contact (minimal)", async ({ request }) => {
    const res = await request.post("/api/intake/contact", {
      headers: { "Content-Type": "application/json" },
      data: {
        name: "E2E Test",
        email: `e2e-contact-${Date.now()}@example.com`,
        phone: "",
        message: "Automated Playwright intake.",
        quickReason: "Other",
        stage: "Exploring",
        subjectType: "individual",
        referralSource: "Other",
        referralOtherDetail: "e2e",
      },
    });
    expect(res.ok()).toBeTruthy();
    const data = (await res.json()) as { ok?: boolean; leadId?: string };
    expect(data.ok).toBe(true);
    expect(data.leadId).toBeTruthy();
  });

  test("POST /api/apply (minimal)", async ({ request }) => {
    const res = await request.post("/api/apply", {
      headers: { "Content-Type": "application/json" },
      data: {
        firstName: "E2E",
        lastName: "Apply",
        email: `e2e-apply-${Date.now()}@example.com`,
        phone: "5555550100",
        howDidYouHear: "e2e",
      },
    });
    expect(res.ok()).toBeTruthy();
    const data = (await res.json()) as { ok?: boolean; leadId?: string };
    expect(data.ok).toBe(true);
    expect(data.leadId).toBeTruthy();
  });

  test("POST /api/newsletter", async ({ request }) => {
    const res = await request.post("/api/newsletter", {
      headers: { "Content-Type": "application/json" },
      data: { email: `e2e-newsletter-${Date.now()}@example.com` },
    });
    expect(res.ok()).toBeTruthy();
    const data = (await res.json()) as { ok?: boolean };
    expect(data.ok).toBe(true);
  });

  test("POST /api/capital-partners", async ({ request }) => {
    const res = await request.post("/api/capital-partners", {
      headers: { "Content-Type": "application/json" },
      data: {
        email: `e2e-partners-${Date.now()}@example.com`,
        name: "E2E Partner",
        organization: "E2E Org",
      },
    });
    expect(res.ok()).toBeTruthy();
    const data = (await res.json()) as { ok?: boolean };
    expect(data.ok).toBe(true);
  });

  test("POST /api/payments/three-step/init rejects invalid checkout (402 or 503)", async ({ request }) => {
    const res = await request.post("/api/payments/three-step/init", {
      headers: { "Content-Type": "application/json" },
      data: {
        enrollments: {},
        billing: { email: "e2e@example.com", firstName: "E", lastName: "E" },
      },
    });
    // 503 when ECRYPT_* is unset; 402 from gateway when a key exists but payload / mode is invalid for a real session.
    expect([402, 503]).toContain(res.status());
    const data = (await res.json()) as { ok?: boolean; error?: string; resultText?: string };
    expect(data.ok).toBe(false);
    expect(String(data.error || data.resultText || "")).toMatch(/.+/);
  });

  test("POST /api/admin/login (preview relax auth)", async ({ request }) => {
    const res = await request.post("/api/admin/login", {
      headers: { "Content-Type": "application/json" },
      data: { password: "admin" },
    });
    expect(res.ok()).toBeTruthy();
    const data = (await res.json()) as { ok?: boolean; token?: string };
    expect(data.ok).toBe(true);
    expect(data.token).toBeTruthy();
  });

  test("GET /api/backoffice/bootstrap without token is 401", async ({ request }) => {
    const res = await request.get("/api/backoffice/bootstrap");
    expect(res.status()).toBe(401);
  });
});
