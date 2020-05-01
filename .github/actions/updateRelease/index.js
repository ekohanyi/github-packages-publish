const core = require("@actions/core");
const github = require("@actions/github");

// const getByTag = tag =>
//   github.repos.getReleaseByTag({
//     owner: this.context.repo.owner,
//     repo: this.context.repo.repo,
//     tag: tag
//   });

try {
  const rawTags = core.getInput("tags");
  core.info(rawTags);
} catch (error) {
  core.error(error.toString());
  core.setFailed(error.change.toString());
}
