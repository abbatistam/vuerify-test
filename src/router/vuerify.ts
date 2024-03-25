import {
  createRouter,
  createWebHistory,
  type RouteRecordNormalized,
  type NavigationGuardNext,
  type RouteLocationNormalized,
  type Router,
  type RouteRecordRaw,
  createWebHashHistory,
} from "vue-router";
import { Ability, type Rule } from "casl";

export interface RouteMeta {
  action?: string;
  subject?: string;
  [index: string | number]: any;
  [symbol: symbol]: any;
}

export interface Route {
  path: string;
  name: string;
  component?: any;
  children?: Route[];
  meta?: RouteMeta;
}

export type RouterHistoryType = "history" | "hash";

export interface RouterConfig {
  routes: Route[];
  permissions: Rule[];
  unauthorizedRoute?: string;
  historyMode?: RouterHistoryType;
}

export class RouterAuthorization {
  private router: Router;
  private ability: Ability;
  private config: RouterConfig;

  constructor(config: RouterConfig) {
    if (!config || !Array.isArray(config.permissions) || !config.routes) {
      throw new Error("Invalid configuration provided.");
    }

    this.config = config;
    this.ability = new Ability(config.permissions);

    const historyMode = config.historyMode || "history";
    const history =
      historyMode === "hash" ? createWebHashHistory() : createWebHistory();

    this.router = createRouter({
      history,
      routes: config.routes.map((route: Route) => {
        const routeRecord: RouteRecordRaw = route as RouteRecordRaw;
        routeRecord.meta = route.meta as RouteMeta;
        return routeRecord;
      }),
    });

    this.router.beforeEach(this.beforeEachGuard.bind(this));
  }

  private updateRouterConfig(newConfig: RouterConfig): void {
    if (
      !newConfig ||
      !Array.isArray(newConfig.permissions) ||
      !newConfig.routes
    ) {
      throw new Error("Invalid updated configuration provided.");
    }

    this.ability.update(newConfig.permissions);

    // Eliminar todas las rutas existentes
    this.router.getRoutes().forEach((route: RouteRecordNormalized) => {
      if (route.name) {
        this.router.removeRoute(route.name);
      }
    });

    // Reemplazar las rutas existentes con las nuevas rutas
    newConfig.routes.forEach((route: Route) => {
      const routeRecord: RouteRecordRaw = route as RouteRecordRaw;
      routeRecord.meta = route.meta as RouteMeta;
      this.router.addRoute(routeRecord); // Agregar cada nueva ruta
    });
  }

  private beforeEachGuard(
    to: RouteLocationNormalized,
    from: RouteLocationNormalized,
    next: NavigationGuardNext
  ): void {
    console.log(to);
    if (!to) {
      // Ruta no existe, redirigir a "unauthorized"
      const unauthorizedRoute = this.config.unauthorizedRoute || "/";
      next(unauthorizedRoute);
      return;
    }
    const { action, subject } = to.meta as RouteMeta;
    /*console.log(action);
    console.log(subject);
    console.log(to);*/
    console.log(this.router.getRoutes());
    if (
      to.name === this.config.unauthorizedRoute ||
      to.path === this.config.unauthorizedRoute
    ) {
      next();
      return;
    }

    let hasPermission = false;
    if (action === undefined || subject === undefined) {
      hasPermission = true;
      next();
      return;
    } else {
      hasPermission = this.ability.can(action, subject);
      if (!hasPermission) {
        const unauthorizedRoute = this.config.unauthorizedRoute || "/";
        next(unauthorizedRoute);
      } else {
        next();
      }
    }
  }

  public getRouter(): Router {
    return this.router;
  }

  public getConfig(): RouterConfig {
    return this.config;
  }

  public updateConfig(newConfig: RouterConfig): void {
    this.updateRouterConfig(newConfig);
    this.config = newConfig;
  }
}

export const generateAuthorizedRoutes = (
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
        const hasPermission = permissions.some((permission) => {
          if (permission.subject === subject) {
            if (typeof permission.actions === "string") {
              return permission.actions === action;
            } else if (
              Array.isArray(permission.actions) &&
              action !== undefined
            ) {
              return permission.actions.includes(action);
            }
          }
          return false;
        });

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
};
