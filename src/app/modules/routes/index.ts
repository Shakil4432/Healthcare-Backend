import express from "express";
import { userRoutes } from "../users/user.routes";
import { AdminsRoutes } from "../admins/admin.routes";
import { AuthRoutes } from "../auth/auth.routes";
const router = express.Router();

const moduleRoutes = [
  {
    path: "/user",
    route: userRoutes,
  },
  {
    path: "/admin",
    route: AdminsRoutes,
  },
  {
    path: "/auth",
    route: AuthRoutes,
  },
];

moduleRoutes.forEach((route) => {
  router.use(route.path, route.route);
});
export default router;
