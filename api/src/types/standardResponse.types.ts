export interface StandardServiceResponse<T> {
  isSuccess: boolean;
  data?: T;
  error?: Error;
}

export interface StandardControllerResponse<T> {
  isSuccess: boolean;
  statusCode: number;
  data?: T;
  error: ErrorResponse;
}

export interface ErrorResponse {
  errorCode: string;
  errorDescription: string;
  errorName?: string;
  stackTrace?: any;
  statusCode: number;
}
