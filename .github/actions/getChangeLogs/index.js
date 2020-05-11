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
  // try {
  const bump = github.context.payload.pull_request.title
    .match(/\[(.*?)\]/)[1]
    .toLowerCase();

  console.log("i made it here");

  if (bump === "patch" || bump === "minor" || bump === "major") {
    return bump;
  } else {
    console.log("i made it to first error ");
    throw new Error(
      `Invalid version bump type found in PR title. \r\nVersion bump type must be "patch", "minor", or "major"`
    );
  }
  // } catch (error) {
  //   console.log("i made it toversion catch error");
  //   if (error) {
  //     throw new Error("No version bump keyword found in PR title");
  //   } else {
  //     throw new Error("No version bump keyword found in PR title");
  //   }
  // }
};

const getLogEntries = log => {
  if (
    github.context.payload.pull_request.body &&
    github.context.payload.pull_request.body.indexOf("**Change log:**\r\n") > -1
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
    console.log(error);
    core.setFailed(error.toString());
  }
};

run();
