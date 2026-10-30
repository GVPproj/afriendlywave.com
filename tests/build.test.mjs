import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { access, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import test from "node:test";

const root = new URL("../", import.meta.url);

function build() {
  const result = spawnSync("pnpm", ["build"], {
    cwd: root,
    stdio: "inherit",
    timeout: 180_000,
  });
  assert.equal(result.status, 0, "Astro build must succeed");
}

test("Astro publishes the native tutorial and removes deleted public assets on rebuild", async () => {
  const source = new URL("public/dj-tutorial/build-test-stale.txt", root);
  const published = new URL("dist/dj-tutorial/build-test-stale.txt", root);
  await mkdir(new URL("public/dj-tutorial/", root), { recursive: true });
  await writeFile(source, "temporary tutorial asset", { flag: "wx" });
  try {
    build();
    for (const page of [
      "index.html",
      "about/index.html",
      "dj-tutorial/index.html",
    ]) {
      assert.match(
        await readFile(new URL(`dist/${page}`, root), "utf8"),
        /<html/,
      );
    }
    const tutorial = await readFile(
      new URL("dist/dj-tutorial/index.html", root),
      "utf8",
    );
    assert.match(
      tutorial,
      /<article\b/,
      "standalone tutorial article is in the page",
    );
    assert.match(tutorial, /<header\b/, "shared header is rendered");
    assert.match(tutorial, /<footer\b/, "shared footer is rendered");
    assert.match(
      tutorial,
      /<template\b[^>]*\bid="mixcloud-data"[^>]*\bdata-src="https:\/\/www\.mixcloud\.com\/widget\/iframe/,
      "shared Mixcloud player configuration is published",
    );
    assert.doesNotMatch(tutorial, /data-dj-deck|Next slide|Previous slide|eleven-slide/);
    assert.match(tutorial, /<ol\b/, "transition checklist is published");
    for (const destination of ["https://mixxx.org/", "https://bandcamp.com/"]) {
      assert.ok(tutorial.includes(`href="${destination}"`));
    }
    assert.doesNotMatch(
      tutorial,
      /data-(?:presenter|speaker|slide)-notes|class="[^"]*(?:presenter|speaker)-notes|\/dj-tutorial\/(?:presenter|notes)\b|@slidev|\bTIME:|\bSAY:|MUSIC PLACEHOLDERS|SCREENSHOT PLACEHOLDER/,
    );
    for (const path of [
      "presenter/index.html",
      "presenter.html",
      "notes/index.html",
      "notes.html",
    ]) {
      await assert.rejects(access(new URL(`dist/dj-tutorial/${path}`, root)), {
        code: "ENOENT",
      });
    }

    assert.doesNotMatch(tutorial, /outro-(?:left|right)\.gif/);
    assert.match(tutorial, /src="\/dj-tutorial\/dj-controller.jpg"/);

    const assets = [
      ...tutorial.matchAll(
        /(?:src|href)="(\/_astro\/[^"?#]+\.(?:js|css))(?:[?#][^"]*)?"/g,
      ),
    ].map((match) => match[1]);
    assert.ok(
      assets.some((asset) => asset.endsWith(".js")),
      "page loads Astro JavaScript",
    );
    assert.ok(
      assets.some((asset) => asset.endsWith(".css")),
      "page loads Astro styles",
    );
    for (const asset of new Set(assets)) {
      await access(new URL(`dist${asset}`, root));
    }
    assert.match(
      tutorial,
      /\/fonts\/[^"')\s]+\.woff2/,
      "page uses shared fonts",
    );
    assert.equal(await readFile(published, "utf8"), "temporary tutorial asset");

    await rm(source);
    build();
    await assert.rejects(access(published), { code: "ENOENT" });
    await access(new URL("dist/dj-tutorial/index.html", root));
    await access(new URL("dist/index.html", root));
  } finally {
    await rm(source, { force: true });
    await rm(published, { force: true });
  }
});
