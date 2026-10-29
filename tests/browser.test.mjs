import { expect, test } from "@playwright/test";

const telemetryOrigin = "https://static.cloudflareinsights.com/";

test.beforeEach(async ({ page }) => {
  await page.route(`${telemetryOrigin}**`, (route) =>
    route.abort("blockedbyclient"),
  );
});

test("tutorial is part of the shared Astro site", async ({ page }) => {
  const response = await page.goto("/dj-tutorial");
  expect(response.status()).toBe(200);
  await expect(page.getByRole("banner")).toBeVisible();
  await expect(page.getByRole("contentinfo")).toBeAttached();
  await expect(page.locator("#mixcloud-player")).toBeAttached();
  await expect(page.locator("[data-dj-deck]")).toBeVisible();
  await expect(page.locator("#slide-1")).toBeVisible();
  await expect(
    page.locator("[data-dj-deck] > .slide-canvas > section"),
  ).toHaveCount(11);
});

test("buttons navigate all eleven slides with a counter and boundary states", async ({
  page,
}) => {
  await page.goto("/dj-tutorial/");
  const navigation = page.getByRole("navigation", { name: "Slide navigation" });
  const previous = navigation.getByRole("button", {
    name: "Previous slide",
    exact: true,
  });
  const next = navigation.getByRole("button", {
    name: "Next slide",
    exact: true,
  });
  await expect(previous).toBeDisabled();
  await expect(navigation.getByRole("status")).toHaveText("1 / 11");
  for (let slide = 2; slide <= 11; slide++) {
    // Controls must remain clickable after the fade, not just during it.
    await page.waitForTimeout(300);
    await next.click();
    await expect(page).toHaveURL(new RegExp(`#slide-${slide}$`));
    await expect(page.locator(`#slide-${slide}`)).toBeVisible();
    await expect(page.locator(".slide-canvas > section:visible")).toHaveCount(
      1,
    );
    await expect(navigation.getByRole("status")).toHaveText(`${slide} / 11`);
  }
  await expect(next).toBeDisabled();
  await previous.click();
  await expect(page.locator("#slide-10")).toBeVisible();
  await expect(next).toBeEnabled();
});

test("deep links, refresh, keys and browser history share slide state", async ({
  page,
}) => {
  await page.goto("/dj-tutorial/#slide-3");
  await expect(page.locator("#slide-3")).toBeVisible();
  await page.reload();
  await expect(page.locator("#slide-3")).toBeVisible();
  for (const [key, slide] of [
    ["ArrowRight", 4],
    ["ArrowLeft", 3],
    ["End", 11],
    ["Home", 1],
  ]) {
    await page.keyboard.press(key);
    await expect(page).toHaveURL(new RegExp(`#slide-${slide}$`));
    await expect(page.locator(`#slide-${slide}`)).toBeVisible();
  }
  await page.goBack();
  await expect(page.locator("#slide-11")).toBeVisible();
  await page.goForward();
  await expect(page.locator("#slide-1")).toBeVisible();
  await page.keyboard.press("ArrowLeft");
  await expect(page).toHaveURL(/#slide-1$/);
  await page.keyboard.press("End");
  await page.keyboard.press("ArrowRight");
  await expect(page).toHaveURL(/#slide-11$/);
});

test("title contents links navigate after returning through the shared site router", async ({
  page,
}) => {
  await page.goto("/dj-tutorial/");
  for (const [name, slide] of [
    ["Tutorial", 2],
    ["Software", 9],
    ["Where to find Music", 10],
  ]) {
    const contents = page.getByRole("navigation", {
      name: "Table of contents",
    });
    await contents.getByRole("link", { name, exact: true }).click();
    await expect(page).toHaveURL(new RegExp(`#slide-${slide}$`));
    await expect(page.locator(`#slide-${slide}`)).toBeVisible();
    await page.keyboard.press("Home");
    await expect(page.locator("#slide-1")).toBeVisible();
  }
  // A pasted fragment also needs to retain route history when leaving the deck.
  await page.goto("/dj-tutorial/#slide-6");
  await expect(page.locator("#slide-6")).toBeVisible();
  await page
    .getByRole("navigation", { name: "Main", exact: true })
    .getByRole("link", { name: "About", exact: true })
    .click();
  await expect(page).toHaveURL(/\/about\/?$/);
  await page.goBack();
  await expect(page.locator("#slide-6")).toBeVisible();
  await page.keyboard.press("ArrowRight");
  await expect(page.locator("#slide-7")).toBeVisible();
  await expect(page).toHaveURL(/#slide-7$/);
});

test("horizontal touch swipes navigate without taking over vertical scrolling", async ({
  browser,
}) => {
  const context = await browser.newContext({
    hasTouch: true,
    viewport: { width: 390, height: 844 },
  });
  const page = await context.newPage();
  await page.goto(`${test.info().project.use.baseURL}/dj-tutorial/#slide-2`);
  const session = await context.newCDPSession(page);
  const canvas = page.locator(".slide-canvas");
  const box = await canvas.boundingBox();
  const y = box.y + Math.min(box.height / 2, 200);
  async function swipe(fromX, fromY, toX, toY) {
    await session.send("Input.dispatchTouchEvent", {
      type: "touchStart",
      touchPoints: [{ x: fromX, y: fromY }],
    });
    await session.send("Input.dispatchTouchEvent", {
      type: "touchMove",
      touchPoints: [{ x: toX, y: toY }],
    });
    await session.send("Input.dispatchTouchEvent", {
      type: "touchEnd",
      touchPoints: [],
    });
  }
  await swipe(300, y, 70, y + 5);
  await expect(page.locator("#slide-3")).toBeVisible();
  await swipe(70, y, 300, y + 5);
  await expect(page.locator("#slide-2")).toBeVisible();
  await swipe(180, y, 190, y - 100);
  await expect(page).toHaveURL(/#slide-2$/);
  await context.close();
});

test("all slide text is at least 14px across responsive layouts", async ({
  page,
}) => {
  for (const viewport of [
    { width: 320, height: 700 },
    { width: 1023, height: 700 },
    { width: 1024, height: 900 },
    { width: 1366, height: 700 },
    { width: 1440, height: 900 },
  ]) {
    await page.setViewportSize(viewport);
    await page.goto("/dj-tutorial/");
    const smallText = await page
      .locator(".workshop-slide")
      .evaluateAll((slides) =>
        slides.flatMap((slide) =>
          [...slide.querySelectorAll("*")].flatMap((element) => {
            const hasVisibleText = [...element.childNodes].some(
              (node) =>
                node.nodeType === Node.TEXT_NODE && node.textContent.trim(),
            );
            if (!hasVisibleText) return [];
            const fontSize = parseFloat(getComputedStyle(element).fontSize);
            return fontSize < 14
              ? [
                  {
                    slide: slide.id,
                    text: element.textContent.trim(),
                    fontSize,
                  },
                ]
              : [];
          }),
        ),
      );
    expect(smallText, `${viewport.width}px slide text`).toEqual([]);
  }
});

test("slide footers show only the slide number, without bottom-left labels", async ({
  page,
}) => {
  await page.goto("/dj-tutorial/");
  const footers = await page.locator(".slide-footer").allTextContents();
  expect(footers).toHaveLength(8);
  for (const footer of footers) {
    expect(footer.trim()).toMatch(/^\d{2} \/ 11$/);
  }
});

test("desktop canvas is width-driven 16:9 with controls below the artwork", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 600 });
  await page.goto("/dj-tutorial/#slide-8");
  const canvas = await page.locator(".slide-canvas").boundingBox();
  expect(canvas.width / canvas.height).toBeCloseTo(16 / 9, 2);
  expect(
    await page.evaluate(() => document.documentElement.scrollHeight),
  ).toBeGreaterThan(600);
  expect(canvas.x).toBeGreaterThan(0);
  const controls = await page
    .getByRole("navigation", { name: "Slide navigation" })
    .boundingBox();
  expect(controls.y).toBeGreaterThanOrEqual(canvas.y + canvas.height);
  for (let slide = 1; slide <= 11; slide++) {
    await page.goto(`/dj-tutorial/#slide-${slide}`);
    const overflows = await page
      .locator(`#slide-${slide}`)
      .evaluate((section) => {
        const bounds = section.getBoundingClientRect();
        return [...section.children]
          .filter((child) => {
            const box = child.getBoundingClientRect();
            return (
              box.bottom > bounds.bottom + 1 || box.right > bounds.right + 1
            );
          })
          .map((child) => child.className);
      });
    expect(overflows, `slide ${slide} fits its artboard`).toEqual([]);
  }
});

test("laptop screens show the whole slide and arrows above the player without scrolling", async ({
  page,
}) => {
  for (const viewport of [
    { width: 1366, height: 700 },
    { width: 1440, height: 800 },
    { width: 1512, height: 850 },
  ]) {
    await page.setViewportSize(viewport);
    await page.goto("/dj-tutorial/");
    const canvas = await page.locator(".slide-canvas").boundingBox();
    const controls = await page
      .getByRole("navigation", { name: "Slide navigation" })
      .boundingBox();
    const header = await page.getByRole("banner").boundingBox();
    const playerHeight = await page
      .locator("#mixcloud-player-container")
      .evaluate((element) => parseFloat(getComputedStyle(element).height));
    expect(canvas.width / canvas.height).toBeCloseTo(16 / 9, 2);
    expect(canvas.y).toBeGreaterThanOrEqual(header.y + header.height);
    expect(controls.y).toBeGreaterThanOrEqual(canvas.y + canvas.height);
    expect(controls.y + controls.height).toBeLessThanOrEqual(
      viewport.height - playerHeight - 8,
    );
    expect(await page.evaluate(() => scrollY)).toBe(0);
  }
});

test("beat diagrams scale proportionally with the desktop artwork", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1024, height: 900 });
  await page.goto("/dj-tutorial/#slide-7");
  const canvas = page.locator(".slide-canvas");
  const beat = page.locator("#slide-7 .deck-beats span").first();
  const smallCanvas = await canvas.boundingBox();
  const smallBeat = await beat.boundingBox();
  await page.setViewportSize({ width: 1440, height: 900 });
  const largeCanvas = await canvas.boundingBox();
  const largeBeat = await beat.boundingBox();
  expect(largeBeat.width / smallBeat.width).toBeCloseTo(
    largeCanvas.width / smallCanvas.width,
    2,
  );
});

test("narrow slides keep readable text and scroll vertically without horizontal overflow", async ({
  page,
}) => {
  for (const width of [320, 390, 767, 768, 834, 1023]) {
    await page.setViewportSize({ width, height: 700 });
    for (let slide = 1; slide <= 11; slide++) {
      await page.goto(`/dj-tutorial/#slide-${slide}`);
      const section = page.locator(`#slide-${slide}`);
      await expect(section).toBeVisible();
      const layout = await section.evaluate((element) => {
        const texts = [
          ...element.querySelectorAll(
            "p, .track-badge, .deck-track, .mixer-small, .software-caption, .tag",
          ),
        ];
        return {
          horizontalOverflow: document.documentElement.scrollWidth > innerWidth,
          smallestCopy: Math.min(
            ...texts.map((text) => parseFloat(getComputedStyle(text).fontSize)),
          ),
          height: element.getBoundingClientRect().height,
        };
      });
      expect(layout.horizontalOverflow, `${width}px slide ${slide}`).toBe(
        false,
      );
      expect(
        layout.smallestCopy,
        `${width}px slide ${slide} copy`,
      ).toBeGreaterThanOrEqual(16);
      const canvas = await page.locator(".slide-canvas").boundingBox();
      const controls = await page
        .getByRole("navigation", { name: "Slide navigation" })
        .boundingBox();
      expect(controls.y).toBeGreaterThanOrEqual(canvas.y + canvas.height - 1);
      if (slide === 9) expect(layout.height).toBeGreaterThan(700);
    }
  }
});

test("narrow slide changes and fragment links keep the start below the sticky header", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 700 });
  await page.goto("/dj-tutorial/#slide-7");
  await page.goto("/dj-tutorial/#slide-8");
  const header = await page.getByRole("banner").boundingBox();
  expect(
    (await page.locator("#slide-8").boundingBox()).y,
  ).toBeGreaterThanOrEqual(header.y + header.height);
  const next = page.getByRole("button", { name: "Next slide", exact: true });
  await next.scrollIntoViewIfNeeded();
  await next.click();
  await expect(page.locator("#slide-9")).toBeVisible();
  expect(
    (await page.locator("#slide-9").boundingBox()).y,
  ).toBeGreaterThanOrEqual(header.y + header.height);
});

test("diagram animations and fade transitions respect reduced motion", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/dj-tutorial/#slide-4");
  const section = page.locator("#slide-4");
  expect(
    await section.evaluate((slide) =>
      slide
        .getAnimations({ subtree: true })
        .some(
          (animation) => animation.effect.getTiming().iterations === Infinity,
        ),
    ),
  ).toBe(true);
  const slider = section.locator(".crossfader");
  const knob = slider.locator("span");
  await expect
    .poll(
      async () => {
        const track = await slider.boundingBox();
        const thumb = await knob.boundingBox();
        return Math.abs(track.x + track.width - thumb.x - thumb.width);
      },
      { timeout: 9000 },
    )
    .toBeLessThan(2);
  await expect(
    section.locator(".deck-card--b .deck-track > .deck-track--after"),
  ).toBeVisible();
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.reload();
  expect(
    await section.evaluate(
      (slide) =>
        slide
          .getAnimations({ subtree: true })
          .filter(
            (animation) => Number(animation.effect.getTiming().duration) > 1,
          ).length,
    ),
  ).toBe(0);
  const track = await slider.boundingBox();
  const thumb = await knob.boundingBox();
  expect(Math.abs(track.x + track.width - thumb.x - thumb.width)).toBeLessThan(
    2,
  );
  await page.keyboard.press("ArrowRight");
  expect(
    await page
      .locator("#slide-5")
      .evaluate((slide) => slide.getAnimations({ subtree: true }).length),
  ).toBe(0);
});

test("every slide loads its images, links and shared fonts without application errors", async ({
  page,
  baseURL,
}) => {
  test.setTimeout(60000);
  const errors = [];
  const fonts = new Set();
  const origin = new URL(baseURL).origin;
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("requestfailed", (request) => {
    if (new URL(request.url()).origin === origin) errors.push(request.url());
  });
  page.on("response", (response) => {
    if (new URL(response.url()).origin === origin && response.status() >= 400)
      errors.push(`${response.status()}: ${response.url()}`);
    if (response.request().resourceType() === "font")
      fonts.add(new URL(response.url()).pathname);
  });
  await page.goto("/dj-tutorial/");
  for (let slide = 1; slide <= 11; slide++) {
    await page.goto(`/dj-tutorial/#slide-${slide}`);
    const section = page.locator(`#slide-${slide}`);
    await expect(section).toBeVisible();
    await expect
      .poll(
        () =>
          section
            .locator("img")
            .evaluateAll((images) =>
              images.every((image) => image.complete && image.naturalWidth > 0),
            ),
        { timeout: 20000 },
      )
      .toBe(true);
    const unsafeLinks = await section
      .locator("a[target='_blank']")
      .evaluateAll((links) =>
        links
          .filter(
            (link) =>
              !link.relList.contains("noopener") ||
              !link.relList.contains("noreferrer"),
          )
          .map((link) => link.href),
      );
    expect(unsafeLinks).toEqual([]);
  }
  const destinations = await page
    .locator(".software-choices a")
    .evaluateAll((links) => links.map((link) => link.href));
  expect(destinations).toEqual(
    expect.arrayContaining([
      "https://mixxx.org/",
      "https://www.algoriddim.com/djay-pro",
      "https://serato.com/dj",
      "https://rekordbox.com/",
      "https://www.native-instruments.com/en/products/traktor/dj-software/traktor-pro-4/",
      "https://freemusicarchive.org/genre/House/",
      "https://bandcamp.com/",
    ]),
  );
  await page.evaluate(() => document.fonts.ready);
  expect([...fonts]).toEqual(
    expect.arrayContaining([
      "/fonts/iosevka-regular.woff2",
      "/fonts/iosevka-bold.woff2",
      "/fonts/iosevka-aile-heavy.woff2",
    ]),
  );
  expect(errors).toEqual([]);
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
    "/dj-tutorial/presenter",
    "/dj-tutorial/notes",
  ]) {
    expect((await request.get(path)).status(), path).toBe(404);
  }
});
