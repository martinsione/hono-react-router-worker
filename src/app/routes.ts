import type { RouteConfig } from "@react-router/dev/routes";
import { index, layout, route } from "@react-router/dev/routes";

export const routes: RouteConfig = [
  //
  index("views/index.tsx"),
  route("/home", "views/home.tsx"),
  route("/dashboard", "views/dashboard.tsx"),

  // Auth Routes
  layout("./layouts/auth.tsx", [
    route("/sign-in", "./views/auth_sign-in.tsx"),
    route("/sign-up", "./views/auth_sign-up.tsx"),
  ]),

  // Catch-all route
  route("*", "./views/catch-all.tsx"),
];
