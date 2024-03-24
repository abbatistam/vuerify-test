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
    actions: "edit",
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

const generateAuthorizedRoutes = (
  routes: Route[],
  permissions: Rule[]
): Route[] => {
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

// Función que simula una llamada a una API para obtener los permisos
const getPermissions = async () => {
  return new Promise<Rule[]>((resolve) => {
    // Simulación de retardo de 1 segundo para obtener los permisos
    setTimeout(() => {
      const permissions: Rule[] = [
        {
          actions: "view",
          subject: "about",
        },
        {
          actions: "view",
          subject: "protected",
        },
      ];
      resolve(permissions);
    }, 1000); // 1 segundo de retardo para simular la llamada a la API
  });
};

// Ejemplo de uso
const authorizedRoutes = generateAuthorizedRoutes(routes, permissions);
//console.log(authorizedRoutes);

const routerConfig: RouterConfig = {
  routes: authorizedRoutes,
  permissions: permissions,
  unauthorizedRoute: "/nonav", // name or path
};

const routerAuth = new RouterAuthorization(routerConfig);
let router = routerAuth.getRouter();

//console.log(router.getRoutes())

export const getApiPermissions = async () => {
  const permissionsApi = await getPermissions()
  const newAutorizedRoutes = generateAuthorizedRoutes(routes,permissionsApi)
  routerAuth.updateConfig({
    routes: newAutorizedRoutes,
    permissions: permissionsApi,
    unauthorizedRoute: "/nonav"
  })
  //(routerAuth.getRouter().getRoutes())
  router = routerAuth.getRouter()
  //console.log(router.getRoutes())
}

export default router;
