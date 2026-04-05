import { Router } from "express";
import HealthRouter from "./health.routes";
import JobRouter from "./job.routes";

export default class V1Router {
  private readonly router: Router;
  private readonly healthRouter: HealthRouter;
  private readonly jobRouter: JobRouter;

  constructor({
    healthRouter,
    jobRouter,
  }: {
    healthRouter: HealthRouter;
    jobRouter: JobRouter;
  }) {
    this.router = Router();
    this.healthRouter = healthRouter;
    this.jobRouter = jobRouter;

    this.registerRoutes();
  }

  private registerRoutes = (): void => {
    this.router.use("/health", this.healthRouter.getRouter());
    this.router.use("/jobs", this.jobRouter.getRouter());
  };

  public getRouter = (): Router => {
    return this.router;
  };
}
