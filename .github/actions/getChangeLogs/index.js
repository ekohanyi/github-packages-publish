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
  const match = github.context.payload.pull_request.title.match(/\[(.*?)\]/);

  if (match && match.length > 1) {
    const bump = match[1].toLowerCase();

    if (bump === "patch" || bump === "minor" || bump === "major") {
      return bump;
    } else {
      throw new Error(
        `Invalid version bump type found in PR title. \r\nVersion bump type must be "patch", "minor", or "major"`
      );
    }
  } else {
    throw new Error("No version bump keyword found in PR title");
  }
};

const getLogEntries = () => {
  if (
    github.context.payload.pull_request.body &&
    github.context.payload.pull_request.body.indexOf("**Change log:**\r\n") > -1
  ) {
    try {
      const log = github.context.payload.pull_request.body.split(
        "**Change log:**\r\n"
      )[1];

      const changes = log.split("\r\n\r\n");
      console.log(changes);
      let entries = {};
      changes.forEach(c => {
        const split = c.split("\r\n");

        entries[split[0]] = "\r\n" + split.slice(1).join("\r\n");
      });

      return entries;
    } catch (error) {
      throw new Error("Change logs are not in correct format");
    }
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
    core.setFailed(error.toString());
  }
};

run();
