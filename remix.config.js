/** @type {import('@remix-run/dev').AppConfig} */
module.exports = {
  ignoredRouteFiles: ["**/.*"],
  serverModuleFormat: "cjs",
  serverDependenciesToBundle: [/^@\//],
  entryClientFile: "app/entry/client.tsx",
  entryServerFile: "app/entry/server.tsx",
} 