const core = require("@actions/core");
const github = require("@actions/github");

function getCommitHash() {
  const changes = {};

  switch (github.context.eventName) {
    case "push": {
      console.log("git in action:", JSON.stringify(github));
      return "0";
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
