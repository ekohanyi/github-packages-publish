const core = require("@actions/core");
const github = require("@actions/github");

const getTitle = () => {
  if (github.context.payload.pull_request.title) {
    return github.context.payload.pull_request.title;
  } else {
    throw new Error(`No PR title found`);
  }
};

const getVersionBump = () => {
  const bump = github.context.payload.pull_request.title
    .match(/\[(.*?)\]/)[1]
    .toLowerCase();

  if (bump === "patch" || bump === "minor" || bump === "major") {
    return bump;
  } else {
    throw new Error(
      `Invalid version bump type ${bump} found in PR title.
      Version bump type must be "patch", "minor", or "major"`
    );
  }
};

const getLogEntries = log => {
  if (
    github.context.payload.pull_request.body &&
    github.context.payload.pull_request.body.indexOf("Change log:") > -1
  ) {
    github.context.payload.pull_request.body.split("**Change log:**\r\n")[1];

    const changes = log.split("\r\n\r\n");
    let entries = {};
    changes.forEach(c => {
      const split = c.split("\r\n");

      entries[split[0]] = "\r\n" + split.slice(1).join("\r\n");
    });

    return entries;
  } else {
    throw new Error(`No change log entries found in PR description.`);
  }
};

const getChanges = () => {
  if (github.context.eventName === "pull_request") {
    if (github.context.payload && github.context.payload.pull_request) {
      const changes = {};

      changes["title"] = getTitle();
      changes["bump"] = getVersionBump();
      changes["logEntries"] = getLogEntries();

      // escape quotes before sending back to action
      return JSON.stringify(changes).replace(/"/gi, '\\"');
    } else {
      throw new Error(`No pull_request found in the payload.`);
    }
  } else {
    throw new Error(`Event "${github.context.eventName}" is not supported.`);
  }
};

const run = () => {
  try {
    core.setOutput("changes", getChanges());
  } catch (error) {
    core.setFailed(error.change.toString());
  }
};

run();
