const core = require("@actions/core");
const github = require("@actions/github");

const getCommitHash = () => {
  if (github.context.eventName === "push") {
    if (github.context.payload && github.context.payload.commits) {
      const length = github.context.payload.commits.length;
      if (length > 1) {
        // return second to last commit hash
        return github.context.payload.commits[length - 2].id;
      } else {
        throw new Error(
          `Commit does not come from a merged PR, no change log exists for it`
        );
      }
    } else {
      throw new Error("No commits found in event payload");
    }
  } else {
    throw new Error(`Event "${github.context.eventName}" is not supported.`);
  }
};

const run = () => {
  try {
    core.setOutput("commit_hash", getCommitHash());
  } catch (error) {
    core.setFailed(error);
  }
};

run();
