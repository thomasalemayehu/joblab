export type JobType = "io" | "cpu";
export type JobStatus = "pending" | "running" | "completed" | "failed";

export default interface Job {
  id: string;
  type: JobType;
  status: JobStatus;
  createdAt: string;
  startedAt?: string;
  completedAt?: string;
  result?: unknown;
  error?: string;
}

export const CPU_TASKS = [
  "countPrimesByTrialDivision",
  "fibonacciRecursive",
] as const;

export type CpuTask = (typeof CPU_TASKS)[number];

export const IO_TASKS = ["writeLargeFile", "manySmallFiles"] as const;

export type IoTask = (typeof IO_TASKS)[number];
