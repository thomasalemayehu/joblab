import { JobStatus, JobType } from "./job.types";

export interface CreateJobSuccessResponse {
  id: string;
  status: JobStatus;
  type: JobType;
  description?: string;
}
