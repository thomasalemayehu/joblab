import { Router } from "express";
import JobController from '../../controllers/job.controller';

export default class JobRouter {
  private readonly router: Router;
  private readonly jobController: JobController;

  constructor({ jobController }: { jobController: JobController }) {
    this.router = Router();
    this.jobController = jobController;

    this.registerRoutes();
  }

  private registerRoutes = (): void => {
    this.router.get("/", this.jobController.getAllJobs);
    this.router.get("/:id", this.jobController.getJobById);
    this.router.post("/io", this.jobController.createIOJob);
    this.router.post("/cpu", this.jobController.createCPUJob);
    this.router.delete("/:id", this.jobController.deleteJobById);
  };

  public getRouter = (): Router => {
    return this.router;
  };
}
