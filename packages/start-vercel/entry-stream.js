import { render, renderActions } from "./app";
import manifest from "../../.output/static/rmanifest.json";
import assetManifest from "../../.output/static/manifest.json";
import prepareManifest from "solid-start/runtime/prepareManifest";

prepareManifest(manifest, assetManifest);

const getResponse = (body, options) => ({
  promise: Promise.resolve(),
  waitUntil: Promise.resolve(),
  response: new Response(body, options)
});

function middleware({ request }) {
  const url = new URL(request.url).pathname;
  if (request.method === "POST") handleAction(request, url);
  else if(!url.includes(".")) {
    const { readable, writable } = new TransformStream();
    render({ url, writable, manifest });
    return getResponse(readable, {
      headers: { "content-type": "text/html;charset=UTF-8" }
    });
  }
  return getResponse(null, {
    headers: {
      "x-middleware-next": "1"
    }
  });
}

async function handleAction(request, url) {
  const body = await request.json();
  const res = await renderActions(url, body);
  return getResponse(res.body, {
    headers: { "content-type": "application/json" },
  })
}

_ENTRIES = typeof _ENTRIES === 'undefined' ? {} : _ENTRIES;

_ENTRIES['middleware_pages/_middleware'] = { default: middleware }