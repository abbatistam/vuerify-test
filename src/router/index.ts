import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import {
  type Route,
  RouterAuthorization,
  type RouterConfig,
  type RouteMeta,
  generateAuthorizedRoutes,
} from "./vuerify";
import AboutView from "@/views/AboutView.vue";
import ProtectedView from "@/views/ProtectedView.vue";
import Nonav from "@/views/Nonav.vue";
import NotFoundView from "@/views/NotFoundView.vue";
import type { Rule } from "casl";
import ChildView from "@/views/ChildView.vue";

const permissions: Rule[] = [
  {
    actions: "edit",
    subject: "about",
  },
  {
    actions: "edit",
    subject: "protected",
  },
  {
    actions: "view",
    subject: "child1",
  },
  {
    actions: "view",
    subject: "child2",
  },
  {
    actions: "edit",
    subject: "child3",
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
  {
    name: "child",
    path: "/child",
    component: ChildView,
    children: [
      {
        name: "child1",
        path: "/child1",
        component: ChildView,
        meta: {
          subject: "child1",
          action: "view",
        },
      },
      {
        name: "child2",
        path: "/child2",
        component: ChildView,
        meta: {
          subject: "child2",
          action: "view",
        },
      },
      {
        name: "child3",
        path: "/child3",
        component: ChildView,
        meta: {
          subject: "child3",
          action: "view",
        },
      },
    ],
  },
  {
    path: "/:catchAll(.*)*",
    name: "not-found",
    component: NotFoundView, // Replace with your 404 component
  },
];
/*
const generateAuthorizedRoutes = (
  routes: Route[],
  permissions: Rule[]
): Route[] => {
  const authorizedRoutes: Route[] = [];

  const traverseRoutes = (routes: Route[]): Route[] => {
    const authorized: Route[] = [];

    routes.forEach((route) => {
      const { meta, children } = route;

      // Verificar si la ruta tiene meta y permiso
      if (meta && typeof meta === "object") {
        const { subject, action } = meta as RouteMeta;
        const hasPermission = permissions.some(
          (permission) =>
            permission.subject === subject &&
            action !== undefined &&
            permission.actions.includes(action)
        );

        if (!hasPermission) {
          return; // Saltar esta ruta si no tiene permiso
        }
      }

      // Agregar la ruta autorizada
      const authorizedRoute: Route = { ...route, children: [] };
      authorized.push(authorizedRoute);

      // Recursivamente agregar las rutas hijas autorizadas
      if (children && children.length > 0) {
        const authorizedChildren = traverseRoutes(children);
        authorizedRoute.children!.push(...authorizedChildren);
      }
    });

    return authorized;
  };

  authorizedRoutes.push(...traverseRoutes(routes));
  return authorizedRoutes;
};*/

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
  const permissionsApi = await getPermissions();
  const newAutorizedRoutes = generateAuthorizedRoutes(routes, permissionsApi);
  routerAuth.updateConfig({
    routes: newAutorizedRoutes,
    permissions: permissionsApi,
    unauthorizedRoute: "/nonav",
  });
  //(routerAuth.getRouter().getRoutes())
  router = routerAuth.getRouter();
  //console.log(router.getRoutes())
};

export default router;
