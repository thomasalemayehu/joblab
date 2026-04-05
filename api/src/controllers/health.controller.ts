import { Request, Response, NextFunction } from "express";
import HealthService from "../services/health.service";
import { HEALTH_SERVICE_GENERAL_FAIL } from "../error";

export default class HealthController {
  private readonly healthService: HealthService;

  constructor({ healthService }: { healthService: HealthService }) {
    this.healthService = healthService;
  }
  public getHealth = (
    _req: Request,
    res: Response,
    next: NextFunction,
  ): void => {
    try {
      const isHealthy = this.healthService.getHealth();
      res.send({
        isSuccess: isHealthy.isSuccess,
        statusCode: 200,
        data: isHealthy.data,
      });
    } catch (error) {
      res.send({
        isSuccess: false,
        statusCode: 400,
        error: {
          errorCode: HEALTH_SERVICE_GENERAL_FAIL,
          errorDescription: "Error while checking service health",
          stackTrace: error,
        },
      });
      next(error);
    }
  };

  public failApp = (): void => {
    this.healthService.failApp();
  };
}
