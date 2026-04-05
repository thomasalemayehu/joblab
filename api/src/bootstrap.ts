import { jobLabApp } from "./utilities/container.util";

const main = async (): Promise<void> => {
  await jobLabApp.start();
};

main();

