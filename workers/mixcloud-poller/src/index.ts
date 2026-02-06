interface Env {
  POLLER_KV: KVNamespace;
  GITHUB_TOKEN: string;
}

interface MixcloudResponse {
  data: { key: string; name: string }[];
}

const MIXCLOUD_API = "https://api.mixcloud.com/afriendlywave/cloudcasts/?limit=1";
const GITHUB_OWNER = "GVPproj";
const GITHUB_REPO = "afriendlywave.com";
const GITHUB_WORKFLOW = "rebuild.yml";
const KV_KEY = "last_show_key";

export default {
  async scheduled(
    _controller: ScheduledController,
    env: Env,
    ctx: ExecutionContext,
  ): Promise<void> {
    ctx.waitUntil(pollMixcloud(env));
  },
} satisfies ExportedHandler<Env>;

async function pollMixcloud(env: Env): Promise<void> {
  // 1. Fetch latest show from Mixcloud
  const res = await fetch(MIXCLOUD_API, {
    headers: { Accept: "application/json" },
  });

  if (!res.ok) {
    console.error(`Mixcloud API error: ${res.status} ${res.statusText}`);
    return;
  }

  const data: MixcloudResponse = await res.json();
  const latestShow = data.data?.[0];

  if (!latestShow) {
    console.error("No shows returned from Mixcloud API");
    return;
  }

  const latestKey = latestShow.key;
  console.log(`Latest Mixcloud show: ${latestShow.name} (${latestKey})`);

  // 2. Compare to stored key
  const storedKey = await env.POLLER_KV.get(KV_KEY);
  console.log(`Stored key: ${storedKey ?? "(none)"}`);

  if (latestKey === storedKey) {
    console.log("No new show detected, skipping rebuild");
    return;
  }

  // 3. Dispatch GitHub Actions rebuild
  console.log("New show detected! Dispatching GitHub Actions rebuild...");

  const dispatchRes = await fetch(
    `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/actions/workflows/${GITHUB_WORKFLOW}/dispatches`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${env.GITHUB_TOKEN}`,
        Accept: "application/vnd.github+json",
        "User-Agent": "mixcloud-poller-worker",
        "X-GitHub-Api-Version": "2022-11-28",
      },
      body: JSON.stringify({
        ref: "main",
        inputs: {
          show_name: latestShow.name,
          show_key: latestKey,
        },
      }),
    },
  );

  if (!dispatchRes.ok) {
    const body = await dispatchRes.text();
    console.error(
      `GitHub dispatch failed: ${dispatchRes.status} ${dispatchRes.statusText} — ${body}`,
    );
    return;
  }

  // 4. Only update KV after successful dispatch
  await env.POLLER_KV.put(KV_KEY, latestKey);
  console.log(`KV updated: ${KV_KEY} = ${latestKey}`);
}
