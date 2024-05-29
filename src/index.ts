import { checkEOLVersions, getRepositoryName } from "./lib/eolAlert";
import * as core from "@actions/core";

async function run() {
  try {
    const repoName = getRepositoryName();
    console.log(`The repository name is: ${repoName}`);

    await checkEOLVersions(repoName);
  } catch (error) {
    if (error instanceof Error) {
      core.setFailed(error.message);
    } else {
      core.setFailed("An unknown error occurred");
    }
  }
}

run();
