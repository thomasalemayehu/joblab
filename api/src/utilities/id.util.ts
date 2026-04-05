import { v4 as uuidv4 } from "uuid";

export default class IdUtil {
  public readonly generateV4 = (): string => {
    return uuidv4();
  };
}
