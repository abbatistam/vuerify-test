import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import {
  type Route,
  RouterAuthorization,
  type RouterConfig,
  type RouteMeta,
} from "./vuerify";
import AboutView from "@/views/AboutView.vue";
import ProtectedView from "@/views/ProtectedView.vue";
import Nonav from "@/views/Nonav.vue";
import type { Rule } from "casl";

const permissions: Rule[] = [
  {
    actions: "view",
    subject: "about",
  },
  {
    actions: "edit",
    subject: "protected",
  },
];

const routes: Route[] = [
  {
    name: "home",
    path: "/",
    component: HomeView,
  },
  {
    name: "about",
    path: "/about",
    component: AboutView,
    meta: {
      subject: "about",
      action: "view",
    },
  },
  {
    name: "protected",
    path: "/protected",
    component: ProtectedView,
    meta: {
      subject: "protected",
      action: "view",
    },
  },
  {
    name: "nonav",
    path: "/nonav",
    component: Nonav,
  },
];

function generateAuthorizedRoutes(
  routes: Route[],
  permissions: Rule[]
): Route[] {
  return routes.filter((route) => {
    const { meta } = route;

    if (!meta || typeof meta !== "object") {
      return true; // La ruta no tiene meta o no es un objeto, se incluye
    }

    const { subject, action } = meta as RouteMeta;

    if (!subject || !action) {
      return true; // La ruta no tiene subject o action, se incluye
    }

    // Verificar si hay algún permiso que coincida con la ruta
    return permissions.some((permission) => {
      return (
        permission.subject === subject && permission.actions.includes(action)
      );
    });
  });
}
// Ejemplo de uso
const authorizedRoutes = generateAuthorizedRoutes(routes, permissions);
console.log(authorizedRoutes);

const routerConfig: RouterConfig = {
  routes: authorizedRoutes,
  permissions: permissions,
  unauthorizedRoute: "/nonav", // name or path
};

const routerAuth = new RouterAuthorization(routerConfig);
const router = routerAuth.getRouter();

export default router;
