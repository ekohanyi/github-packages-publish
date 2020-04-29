const core = require("@actions/core");
const github = require("@actions/github");

function getChangeLogEntry() {
  const changes = {};

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
          changes["title"] = github.context.payload.pull_request.title;
          changes["bump"] = github.context.payload.pull_request.title.match(
            /\[(.*?)\]/
          )[1];
          changes["logEntry"] = github.context.payload.pull_request.body.split(
            "Change log:"
          )[1];
          core.info(JSON.stringify(changes));
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
  core.setOutput("changes", JSON.stringify(getChangeLogEntry()));
} catch (error) {
  core.error(error.toString());
  core.setFailed(error.change.toString());
}
