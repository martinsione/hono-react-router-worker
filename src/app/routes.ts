import type { RouteConfig } from "@react-router/dev/routes";
import { index, route } from "@react-router/dev/routes";

export const routes: RouteConfig = [
  //
  index("views/index.tsx"),
  route("/home", "views/home.tsx"),
  route("/dashboard", "views/dashboard.tsx"),

  // Catch-all route
  route("*", "./views/catch-all.tsx"),
];
