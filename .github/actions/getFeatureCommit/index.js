const core = require("@actions/core");
const github = require("@actions/github");

function getCommitHash() {
  switch (github.context.eventName) {
    case "push": {
      const length = github.context.payload.commits.length;
      if (length > 1) {
        // return second to last commit hash
        return github.context.payload.commits[length - 2].id;
      } else {
        throw new Error(
          `Commit does not come from a merged PR, no change log exists for it`
        );
      }
    }
    default: {
      throw new Error(`Event "${github.context.eventName}" is not supported.`);
    }
  }
}

try {
  core.setOutput("commit_hash", getCommitHash());
} catch (error) {
  core.error(error.toString());
  core.setFailed(error.change.toString());
}
