const core = require("@actions/core");
const github = require("@actions/github");

function getChangeLogEntry() {
  const changes = [];

  switch (github.context.eventName) {
    case "pull_request": {
      if (
        github.context.payload &&
        github.context.payload.pull_request &&
        github.context.payload.pull_request.title
      ) {
        if (
          github.context.payload.pull_request.body &&
          github.context.payload.pull_request.body.indexOf("Change log:") > -1
        ) {
          let change = github.context.payload.pull_request.title;
          const logEntry = github.context.payload.pull_request.body.split(
            "Change log:"
          )[1];
          change = change.concat("\n", logEntry);
          changes.push(change);
          core.info(changes.toString());
        } else {
          throw new Error(`No change log entry found in PR description.`);
        }
      } else {
        throw new Error(`No pull_request found in the payload.`);
      }
      break;
    }
    default: {
      throw new Error(`Event "${github.context.eventName}" is not supported.`);
    }
  }

  return changes;
}

try {
  core.setOutput("changes", getChangeLogEntry().toString());
} catch (error) {
  core.error(error.toString());
  core.setFailed(error.change.toString());
}
