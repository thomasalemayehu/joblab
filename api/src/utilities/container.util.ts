import { JobLab } from "..";
import { DEFAULT_APP_PORT } from "../constants";
import HealthController from "../controllers/health.controller";
import JobController from "../controllers/job.controller";
import V1Router from "../routers/v1";
import HealthRouter from "../routers/v1/health.routes";
import JobRouter from "../routers/v1/job.routes";
import HealthService from "../services/health.service";
import JobService from "../services/job.service";
import { MathUtil } from "../utilities/math.util";
import FileUtil from "../utilities/file.util";
import IdUtil from "../utilities/id.util";
import StorageUtil from "../utilities/storage.util";

// Health Stuff
const healthService: HealthService = new HealthService();
const healthController: HealthController = new HealthController({
  healthService: healthService,
});
const healthRouter: HealthRouter = new HealthRouter({
  healthController: healthController,
});

// Job Stuff
const mathUtil: MathUtil = new MathUtil();
const fileUtil: FileUtil = new FileUtil();
const idUtil: IdUtil = new IdUtil();
const storageUtil: StorageUtil = new StorageUtil();
const jobService: JobService = new JobService({
  mathUtil,
  fileUtil,
  idUtil,
  storageUtil,
});
const jobController: JobController = new JobController({
  jobService: jobService,
});
const jobRouter: JobRouter = new JobRouter({
  jobController: jobController,
});

// v1 router
const v1Router: V1Router = new V1Router({
  healthRouter: healthRouter,
  jobRouter: jobRouter,
});

// Main
export const jobLabApp: JobLab = new JobLab({
  PORT: Number(process.env.PORT) || DEFAULT_APP_PORT,
  v1Router: v1Router,
});
