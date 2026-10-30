import { expect, test } from "@playwright/test";

const telemetryOrigin = "https://static.cloudflareinsights.com/";

test.beforeEach(async ({ page }) => {
  await page.route(`${telemetryOrigin}**`, (route) => route.abort("blockedbyclient"));
});

test("the whole guide can be read without JavaScript", async ({ browser, baseURL }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto(`${baseURL}/dj-tutorial/`);
  const article = page.getByRole("article");
  await expect(article.getByRole("heading", { level: 1 })).toBeVisible();
  // All teaching sections are available at once, not just an active slide.
  for (const section of await article.locator("section").all()) {
    await expect(section).toBeVisible();
    await expect(section.getByRole("heading")).toBeVisible();
  }
  await expect(article.locator("ol > li")).toHaveCount(4);
  await article.getByRole("link", { name: "Bandcamp", exact: true }).scrollIntoViewIfNeeded();
  await expect(article.getByRole("link", { name: "Bandcamp", exact: true })).toBeInViewport();
  await expect(article.getByRole("button")).toHaveCount(0);
  await context.close();
});

test("prose and full-bleed illustrations fit desktop and narrow screens", async ({ page }) => {
  for (const width of [320, 390, 768, 1023, 1024, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/dj-tutorial/");
    const article = page.getByRole("article");
    const heading = await article.getByRole("heading", { level: 1 }).boundingBox();
    const photo = await article.getByRole("img", { name: /Pioneer DDJ-400/ }).boundingBox();
    expect(photo.x).toBeLessThan(heading.x);
    expect(photo.width).toBeGreaterThan(heading.width);
    if (width === 1440) {
      const diagram = await article.locator(".deck-setup").first().boundingBox();
      const home = await page.getByRole("link", { name: "A Friendly Wave home", exact: true }).boundingBox();
      expect(diagram.width).toBeGreaterThan(heading.width);
      expect(diagram.x).toBeCloseTo(home.x, 0);
    }
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    const overflow = await article.evaluate((element) =>
      [...element.querySelectorAll("figure, section")]
        .filter((child) => child.scrollWidth > child.clientWidth + 1)
        .map((child) => child.id || child.tagName),
    );
    expect(overflow, `${width}px content overflow`).toEqual([]);
    const tinyText = await article.evaluate((element) =>
      [...element.querySelectorAll("*")].filter((child) =>
        [...child.childNodes].some((node) => node.nodeType === Node.TEXT_NODE && node.textContent.trim()) &&
        parseFloat(getComputedStyle(child).fontSize) < 14,
      ).map((child) => child.textContent),
    );
    expect(tinyText, `${width}px readable text`).toEqual([]);
  }
});

test("instructional motion runs normally and stops for reduced motion", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/dj-tutorial/");
  const article = page.getByRole("article");
  await expect.poll(() => article.evaluate((element) => element.getAnimations({ subtree: true }).length)).toBeGreaterThan(0);
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect.poll(() => article.evaluate((element) => element.getAnimations({ subtree: true }).length)).toBe(0);
  await expect(article.locator("img[src$='.gif']")).toHaveCount(0);
});

test("old tutorial fragments still reach visible content below the header", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  for (const fragment of ["slide-3", "slide-6", "slide-9", "slide-10"]) {
    await page.goto(`/dj-tutorial/#${fragment}`);
    const target = page.locator(`#${fragment}`);
    await expect(target).toBeInViewport();
    const header = await page.getByRole("banner").boundingBox();
    expect((await target.boundingBox()).y).toBeGreaterThanOrEqual(header.y + header.height);
  }
});

test("tutorial images and resource destinations remain available", async ({ page }) => {
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("/dj-tutorial/");
  const article = page.getByRole("article");
  await expect.poll(() => article.locator("img").evaluateAll((images) =>
    images.every((image) => image.complete && image.naturalWidth > 0),
  )).toBe(true);
  expect(await article.getByRole("link").evaluateAll((links) => links.map((link) => link.href))).toEqual([
    "https://mixxx.org/",
    "https://www.algoriddim.com/djay-pro",
    "https://serato.com/dj",
    "https://rekordbox.com/",
    "https://www.native-instruments.com/en/products/traktor/dj-software/traktor-pro-4/",
    "https://freemusicarchive.org/genre/House/",
    "https://bandcamp.com/",
  ]);
  expect(errors).toEqual([]);
});

test("existing Astro pages render and missing paths remain 404s", async ({ page, request }) => {
  for (const path of ["/", "/about", "/join", "/artists", "/vendors", "/workshop"]) {
    const response = await page.goto(path, { waitUntil: "domcontentloaded" });
    expect(response.status(), path).toBe(200);
    await expect(page.getByRole("banner")).toBeVisible();
    await expect(page).toHaveTitle(/A Friendly Wave/);
  }
  for (const path of ["/nonexistent-page", "/about/nonexistent-page", "/dj-tutorial/nonexistent-page", "/dj-tutorial/presenter", "/dj-tutorial/notes"]) {
    expect((await request.get(path)).status(), path).toBe(404);
  }
});
