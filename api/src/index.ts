import express, { Application } from "express";
import swaggerUi from "swagger-ui-express";
import { createOpenApiSpec } from "./docs/openapi";
import V1Router from "./routers/v1";

export class JobLab {
  private app: Application;
  private PORT: number;

  private v1Router: V1Router;

  constructor({ PORT, v1Router }: { PORT: number; v1Router: V1Router }) {
    this.PORT = PORT;
    this.app = express();
    this.v1Router = v1Router;
  }

  private registerMiddlewares = (): void => {
    this.app.use(express.json());
  };

  private registerRoutes = (): void => {
    this.app.use("/v1", this.v1Router.getRouter());
  };

  private registerDocs = (): void => {
    const serverUrl =
      process.env.PUBLIC_BASE_URL || `http://localhost:${this.PORT}`;
    const spec = createOpenApiSpec({
      version: process.env.APP_VERSION || "0.0.1",
      serverUrl,
    });

    this.app.get("/openapi.json", (_req, res) => {
      res.json(spec);
    });

    this.app.use("/docs", swaggerUi.serve, swaggerUi.setup(spec));
  };

  private registerErrorHandler = (): void => {};

  public start = (): void => {
    this.registerMiddlewares();
    this.registerRoutes();
    this.registerDocs();
    this.registerErrorHandler();
    this.app.listen(this.PORT, () => {
      console.log(`job-lab listening on port ${this.PORT}`);
    });
  };
}
