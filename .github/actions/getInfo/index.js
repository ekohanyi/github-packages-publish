const core = require("@actions/core");
const github = require("@actions/github");

function getLogEntries(log) {
  const changes = log.split("\r\n\r\n");
  let entries = {};
  changes.forEach(c => {
    const split = c.split("\r\n");

    entries[split[0]] = "\r\n" + split.slice(1).join("\r\n");
  });

  return entries;
}

function getChangeLog() {
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
          changes["logEntries"] = getLogEntries(
            github.context.payload.pull_request.body.split("Change log:\r\n")[1]
          );
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

  // escape quotes before sending back to action
  return JSON.stringify(changes).replace(/"/gi, '\\"');
}

try {
  core.setOutput("changes", getChangeLog());
} catch (error) {
  core.error(error.toString());
  core.setFailed(error.change.toString());
}
