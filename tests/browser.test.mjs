import { expect, test } from "@playwright/test";

test("tutorial navigation stays clickable after slide transitions", async ({ page }) => {
  await page.goto("/dj-tutorial/");
  const navigation = page.getByRole("navigation", { name: "Slide navigation" });
  for (let slide = 2; slide <= 11; slide++) {
    // Wait for the fade to settle: the controls must not only work mid-transition.
    await page.waitForTimeout(800);
    await navigation.getByRole("button", { name: "Next slide", exact: true }).click();
    await expect(page).toHaveURL(new RegExp(`/#/${slide}$`));
  }
  await page.waitForTimeout(800);
  await navigation.getByRole("button", { name: "Previous slide", exact: true }).click();
  await expect(page).toHaveURL(/\/#\/10$/);
});

const telemetryOrigin = "https://static.cloudflareinsights.com/";

// Telemetry is outside the tutorial contract; don't count automated test visits.
test.beforeEach(async ({ page }) => {
  await page.route(`${telemetryOrigin}**`, (route) =>
    route.abort("blockedbyclient"),
  );
});

test("tutorial loads all slides and keeps its assets under the tutorial path", async ({
  page,
  baseURL,
}) => {
  const errors = [];
  const unscoped = [];
  const fonts = new Set();
  const origin = new URL(baseURL).origin;
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("console", (message) => {
    if (
      message.type() === "error" &&
      !message.location().url.startsWith(telemetryOrigin)
    ) {
      errors.push(message.text());
    }
  });
  page.on("requestfailed", (request) => {
    if (!request.url().startsWith(telemetryOrigin)) {
      errors.push(`${request.url()}: ${request.failure()?.errorText}`);
    }
  });
  page.on("request", (request) => {
    const url = new URL(request.url());
    if (url.origin === origin && !url.pathname.startsWith("/dj-tutorial/")) {
      unscoped.push(url.pathname);
    }
  });
  page.on("response", (response) => {
    if (response.status() >= 400)
      errors.push(`${response.status()}: ${response.url()}`);
    if (response.request().resourceType() === "font")
      fonts.add(new URL(response.url()).pathname);
  });

  await page.goto("/dj-tutorial/");
  await expect(
    page.getByRole("navigation", { name: "Table of contents" }),
  ).toBeVisible();
  for (let slide = 1; slide <= 11; slide++) {
    await page.goto(`/dj-tutorial/#/${slide}`);
    const currentSlide = page.locator(`[data-slidev-no="${slide}"]`);
    // The slide wrapper appears before its lazy-loaded content on a real network.
    await expect(currentSlide.locator(".slidev-layout")).toBeVisible();
    // All slide images must decode, including logos and the external outro GIFs.
    await expect
      .poll(() =>
        currentSlide
          .locator("img")
          .evaluateAll((images) =>
            images.every((image) => image.complete && image.naturalWidth > 0),
          ),
      )
      .toBe(true);
    await page.evaluate(() => document.fonts.ready);
  }
  expect([...fonts]).toEqual(
    expect.arrayContaining([
      "/dj-tutorial/fonts/iosevka-regular.woff2",
      "/dj-tutorial/fonts/iosevka-bold.woff2",
      "/dj-tutorial/fonts/iosevka-aile-heavy.woff2",
    ]),
  );
  expect(unscoped).toEqual([]);
  expect(errors).toEqual([]);
});

test("tutorial opens without a trailing slash and its contents links navigate", async ({
  page,
}) => {
  const response = await page.goto("/dj-tutorial");
  expect(response.status()).toBe(200);
  const contents = page.getByRole("navigation", { name: "Table of contents" });
  await expect(contents).toBeVisible();
  await contents.getByRole("link", { name: "Tutorial", exact: true }).click();
  await expect(page).toHaveURL(/\/dj-tutorial\/#\/2$/);
  await expect(
    page.getByRole("img", {
      name: "Pioneer DJ DDJ-400 controller with two decks and a central mixer",
    }),
  ).toBeVisible();
});

test("existing Astro pages render and missing paths remain 404s", async ({
  page,
  request,
}) => {
  for (const path of [
    "/",
    "/about",
    "/join",
    "/artists",
    "/vendors",
    "/workshop",
  ]) {
    const response = await page.goto(path, { waitUntil: "domcontentloaded" });
    expect(response.status(), path).toBe(200);
    await expect(page.getByRole("banner")).toBeVisible();
    await expect(page).toHaveTitle(/A Friendly Wave/);
  }
  for (const path of [
    "/nonexistent-page",
    "/about/nonexistent-page",
    "/dj-tutorial/nonexistent-page",
  ]) {
    expect((await request.get(path)).status(), path).toBe(404);
  }
});

test("tutorial hash links survive refresh and keyboard navigation", async ({
  page,
}) => {
  await page.goto("/dj-tutorial/#/3");
  const diagram = page
    .getByLabel(
      "Simplified two-deck DJ setup, not an exact software screenshot",
    )
    .filter({ visible: true });
  await expect(diagram).toBeVisible();
  await page.reload();
  await expect(diagram).toBeVisible();

  await page.keyboard.press("ArrowRight");
  await expect(page).toHaveURL(/\/dj-tutorial\/#\/4$/);
  await page.keyboard.press("ArrowLeft");
  await expect(page).toHaveURL(/\/dj-tutorial\/#\/3$/);
  await expect(diagram).toHaveCount(1);
  await expect(diagram).toBeVisible();
});
