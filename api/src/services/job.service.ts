import Job, { IoTask } from "../types/job.types";
import { CreateJobSuccessResponse } from "../types/response.types";
import { StandardServiceResponse } from "../types/standardResponse.types";
import { CpuTask } from "../types/job.types";
import { MathUtil } from "../utilities/math.util";
import IdUtil from "../utilities/id.util";
import StorageUtil from "../utilities/storage.util";
import FileUtil from "../utilities/file.util";
export default class JobService {
  private readonly mathUtil: MathUtil;
  private readonly fileUtil: FileUtil;
  private readonly idUtil: IdUtil;
  private readonly storageUtil: StorageUtil;
  private readonly actionToFunctionMap: Record<
    CpuTask | IoTask,
    (n: number) => Promise<unknown> | unknown
  >;

  constructor({
    mathUtil,
    fileUtil,
    idUtil,
    storageUtil,
  }: {
    mathUtil: MathUtil;
    fileUtil: FileUtil;
    idUtil: IdUtil;
    storageUtil: StorageUtil;
  }) {
    this.mathUtil = mathUtil;
    this.fileUtil = fileUtil;
    this.storageUtil = storageUtil;
    this.idUtil = idUtil;
    this.actionToFunctionMap = {
      // cpu
      countPrimesByTrialDivision: (n: number) =>
        this.mathUtil.countPrimesByTrialDivision({ n }),
      fibonacciRecursive: (n: number) => this.mathUtil.fibonacciRecursive(n),

      // io
      writeLargeFile: (n: number) => this.fileUtil.writeLargeFile(n),
      manySmallFiles: (n: number) => this.fileUtil.manySmallFiles(n),
    };
  }
  public createIOJob = async ({
    ioTask,
    number,
  }: {
    ioTask: IoTask;
    number?: number;
  }): Promise<StandardServiceResponse<CreateJobSuccessResponse>> => {
    const id = this.idUtil.generateV4();
    const n = Number.isFinite(number) ? Math.floor(number as number) : 0;
    this.actionToFunctionMap[ioTask](n);
    const job: Job = {
      id: id,
      status: "pending",
      createdAt: Date.now().toLocaleString(),
      type: "io",
    };
    this.storageUtil.addJob({ job: job });
    return {
      isSuccess: true,
      data: {
        id: id,
        type: "io",
        status: "pending",
        description: `Job ${id} has been created`,
      },
    };
  };
  public createCPUJob = async ({
    cpuTask,
    number,
  }: {
    cpuTask: CpuTask;
    number?: number;
  }): Promise<StandardServiceResponse<CreateJobSuccessResponse>> => {
    const id = this.idUtil.generateV4();
    const n = Number.isFinite(number) ? Math.floor(number as number) : 0;
    this.actionToFunctionMap[cpuTask](n);
    const job: Job = {
      id: id,
      status: "pending",
      createdAt: Date.now().toLocaleString(),
      type: "cpu",
    };
    this.storageUtil.addJob({ job: job });

    return {
      isSuccess: true,
      data: {
        id: id,
        type: "cpu",
        status: "pending",
        description: `Job ${id} has been created`,
      },
    };
  };
  public getJobById = async ({
    id,
  }: {
    id: string;
  }): Promise<StandardServiceResponse<Job>> => {
    const job: Job | undefined = this.storageUtil.getJobById({ id: id });
    if (!job) {
      throw Error(`Job with ${id} is not found`);
    }
    return {
      isSuccess: true,
      data: job,
    };
  };
  public getAllJobs = async ({
    page,
    limit,
  }: {
    page: number;
    limit: number;
  }): Promise<StandardServiceResponse<Job[]>> => {
    const allJobs = this.storageUtil.getAllJobs({ page: page, limit: limit });
    return {
      isSuccess: true,
      data: allJobs,
    };
  };
  public deleteJobById = async ({
    id,
  }: {
    id: string;
  }): Promise<StandardServiceResponse<Job>> => {
    const job = this.storageUtil.deleteJobById({ id: id });
    return {
      isSuccess: true,
      data: job,
    };
  };
}
