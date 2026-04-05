import { StandardServiceResponse } from "../types/standardResponse.types";

export default class HealthService {
  public getHealth = (): StandardServiceResponse<boolean> => {
    return { isSuccess: true, data: true };
  };

  public failApp = (): void => {
    throw Error("App failed on purpose");
  };
}
