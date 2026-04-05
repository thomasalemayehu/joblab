import ValidationError from "../error/validation.error";
import Job from "../types/job.types";

export default class StorageUtil {
  private jobs: Map<string, Job> = new Map();

  public readonly addJob = ({ job }: { job: Job }): Job => {
    if (this.jobs.get(job.id)) {
      throw new ValidationError(`Job with id ${job.id} already exists`);
    }
    this.jobs.set(job.id, job);
    return job;
  };
  public readonly getJobById = ({ id }: { id: string }): Job | undefined => {
    return this.jobs.get(id);
  };
  public readonly getAllJobs = ({
    page,
    limit,
  }: {
    page: number;
    limit: number;
  }): Job[] => {
    const p = page > 0 ? Math.floor(page) : 1;
    const l = limit > 0 ? Math.floor(limit) : 10;
    const start = (p - 1) * l;
    return Array.from(this.jobs.values()).slice(start, start + l);
  };
  public readonly deleteJobById = ({ id }: { id: string }): Job | undefined => {
    const job = this.jobs.get(id);
    this.jobs.delete(id);
    return job;
  };
}
