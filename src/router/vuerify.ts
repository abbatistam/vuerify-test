import {
  createRouter,
  createWebHistory,
  type RouteRecordNormalized,
  type NavigationGuardNext,
  type RouteLocationNormalized,
  type Router,
  type RouteRecordRaw,
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
  meta?: RouteMeta;
}

export interface RouterConfig {
  routes: Route[];
  permissions: Rule[];
  unauthorizedRoute?: string;
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

    this.router = createRouter({
      history: createWebHistory(),
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
    const { action, subject } = to.meta as RouteMeta;

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
