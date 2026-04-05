import { error } from "node:console";
import JobService from "../services/job.service";
import { Request, Response, NextFunction } from "express";
import {
  CREATE_IO_JOB_GENERAL_FAIL,
  CREATE_CPU_JOB_GENERAL_FAIL,
  GET_ALL_JOBS_GENERAL_FAIL,
  DELETE_JOB_BY_ID_GENERAL_FAIL,
  GET_JOB_BY_ID_GENERAL_FAIL,
} from "../error";
import { CPU_TASKS, CpuTask, IO_TASKS, IoTask } from "../types/job.types";
import ValidationError from "../error/validation.error";
export default class JobController {
  private readonly jobService: JobService;

  constructor({ jobService }: { jobService: JobService }) {
    this.jobService = jobService;
  }

  public createIOJob = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const { action, number } = req.query;
      if (!action) {
        throw new ValidationError("Action is required");
      } else if (!this.isIoTask(action)) {
        throw new ValidationError(`Action ${action} is not allowed.`);
      }

      const createIOJobResponse = await this.jobService.createIOJob({
        ioTask: action,
        number: Number.parseInt(typeof number === "string" ? number : "0"),
      });
      res.send({
        isSuccess: createIOJobResponse.isSuccess,
        statusCode: 200,
        data: createIOJobResponse.data,
      });
    } catch (error) {
      res.send({
        isSuccess: false,
        error: {
          errorCode: CREATE_IO_JOB_GENERAL_FAIL,
          errorDescription: "Error creating IO job",
          stackTrace: error,
        },
        statusCode: 400,
      });
      next(error);
    }
  };
  public createCPUJob = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const { action, number } = req.query;
      if (!action) {
        throw new ValidationError("Action is required");
      } else if (!this.isCpuTask(action)) {
        throw new ValidationError(`Action ${action} is not allowed.`);
      }

      const createCPUJobResponse = await this.jobService.createCPUJob({
        cpuTask: action,
        number: Number.parseInt(typeof number === "string" ? number : "0"),
      });
      res.send({
        isSuccess: createCPUJobResponse.isSuccess,
        statusCode: 200,
        data: createCPUJobResponse.data,
      });
    } catch (error) {
      res.send({
        isSuccess: false,
        error: {
          errorCode: CREATE_CPU_JOB_GENERAL_FAIL,
          errorDescription: "Error creating CPU job",
          stackTrace: error,
        },
        statusCode: 400,
      });
      next(error);
    }
  };
  public getJobById = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const { id } = req.params;

      if (!id) {
        throw new ValidationError("Id is required");
      }
      const getJobByIdResponse = await this.jobService.getJobById({
        id: id as string,
      });
      res.send({
        isSuccess: getJobByIdResponse.isSuccess,
        statusCode: 200,
        data: getJobByIdResponse.data,
      });
    } catch (error) {
      res.send({
        isSuccess: false,
        error: {
          errorCode: GET_JOB_BY_ID_GENERAL_FAIL,
          errorDescription: "Error getting job by id",
          stackTrace: error,
        },
        statusCode: 400,
      });
      next(error);
    }
  };
  public getAllJobs = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const { page, limit } = req.query;

      const getAllJobsResponse = await this.jobService.getAllJobs({
        page: Number.parseInt(typeof page === "string" ? page : "1"),
        limit: Number.parseInt(typeof limit === "string" ? limit : "10"),
      });
      res.send({
        isSuccess: getAllJobsResponse.isSuccess,
        statusCode: 200,
        data: getAllJobsResponse.data,
      });
    } catch (error) {
      res.send({
        isSuccess: false,
        error: {
          errorCode: GET_ALL_JOBS_GENERAL_FAIL,
          errorDescription: "Error getting jobs",
          stackTrace: error,
        },
        statusCode: 400,
      });
      next(error);
    }
  };
  public deleteJobById = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const { id } = req.params;
      if (!id) {
        throw new ValidationError("Id is required");
      }

      const deleteJobById = await this.jobService.deleteJobById({
        id: id as string,
      });
      res.send({
        isSuccess: deleteJobById.isSuccess,
        statusCode: 200,
        data: deleteJobById.data,
      });
    } catch (error) {
      res.send({
        isSuccess: false,
        error: {
          errorCode: DELETE_JOB_BY_ID_GENERAL_FAIL,
          errorDescription: "Error getting deleting job",
          stackTrace: error,
        },
        statusCode: 400,
      });
      next(error);
    }
  };

  private isCpuTask = (v: unknown): v is CpuTask =>
    typeof v === "string" && CPU_TASKS.includes(v as CpuTask);

  private isIoTask = (v: unknown): v is IoTask =>
    typeof v === "string" && IO_TASKS.includes(v as IoTask);
}
