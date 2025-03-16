import { vitePlugin as remix } from "@remix-run/dev";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import path from "path";

declare module "@remix-run/node" {
  interface Future {
    v3_singleFetch: true;
  }
}

export default defineConfig({
  plugins: [
    remix({
      future: {
        v3_fetcherPersist: true,
        v3_relativeSplatPath: true,
        v3_throwAbortReason: true,
        v3_singleFetch: true,
        v3_lazyRouteDiscovery: true,
      },
      routes(defineRoutes) {
        return defineRoutes((route) => {
          route("/", "routes/_index.tsx", { index: true });
          route("about", "routes/about/route.tsx");
          route("about/edit", "routes/about/edit/route.tsx");
          route("tasks", "routes/tasks/route.tsx");
          
          // Nested routes for Rick and Morty
          route("rick-and-morty", "routes/rick-and-morty/layout.tsx", () => {
            route("", "routes/rick-and-morty/route.tsx", { index: true });
            route(":characterId", "routes/rick-and-morty/$characterId/route.tsx");
          });
        });
      },
    }),
    tsconfigPaths(),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./app"),
    },
  },
});
