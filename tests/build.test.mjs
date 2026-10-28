import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { access, readFile, readdir, rm, writeFile } from "node:fs/promises";
import test from "node:test";

const root = new URL("../", import.meta.url);

function build() {
  const result = spawnSync("pnpm", ["build"], {
    cwd: root,
    stdio: "inherit",
    timeout: 180_000,
  });
  assert.equal(result.status, 0, "combined build must succeed");
}

test("root build publishes both sites and removes deleted tutorial assets on rebuild", async () => {
  const source = new URL("dj-tutorial/public/build-test-stale.txt", root);
  const published = new URL("dist/dj-tutorial/build-test-stale.txt", root);
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
    const assets = await readdir(new URL("dist/dj-tutorial/assets/", root));
    assert.ok(
      assets.some((asset) => asset.endsWith(".js")),
      "tutorial JavaScript is published",
    );
    assert.ok(
      assets.some((asset) => asset.endsWith(".css")),
      "tutorial styles are published",
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
    await rm(new URL("dj-tutorial/dist/build-test-stale.txt", root), {
      force: true,
    });
  }
});
