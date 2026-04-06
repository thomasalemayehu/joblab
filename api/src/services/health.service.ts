import { StandardServiceResponse } from "../types/standardResponse.types";

export default class HealthService {
  public getHealth = (): StandardServiceResponse<{
    timestamp: string;
    status: string;
  }> => {
    return {
      isSuccess: true,
      data: {
        timestamp: Date().toString(),
        status: "healthy",
      },
    };
  };

  public failApp = (): void => {
    throw Error("App failed on purpose");
  };
}
