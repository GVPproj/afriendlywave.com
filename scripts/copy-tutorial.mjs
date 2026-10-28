import { cp, rm } from "node:fs/promises";

const source = new URL("../dj-tutorial/dist/", import.meta.url);
const destination = new URL("../dist/dj-tutorial/", import.meta.url);

await rm(destination, { recursive: true, force: true });
await cp(source, destination, { recursive: true });
