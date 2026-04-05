import { Router } from "express";
import HealthController from "../../controllers/health.controller";

export default class HealthRouter {
  private readonly router: Router;
  private readonly healthController: HealthController;

  constructor({ healthController }: { healthController: HealthController }) {
    this.router = Router();
    this.healthController = healthController;

    this.registerRoutes();
  }

  private registerRoutes = (): void => {
    this.router.get("/fail", this.healthController.failApp);
    this.router.get("/", this.healthController.getHealth);
  };

  public getRouter = (): Router => {
    return this.router;
  };
}
