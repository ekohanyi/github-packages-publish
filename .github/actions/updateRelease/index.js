const core = require("@actions/core");
const github = require("@actions/github");

const getByTag = (git, tag) => {
  console.log(git.repos.getReleaseByTag);
  console.log(tag);
  return git.repos.getReleaseByTag({
    owner: github.context.repo.owner,
    repo: github.context.repo.repo,
    tag: tag
  });
};

try {
  const tags = core.getInput("tags").split(",");
  const token = core.getInput("token");
  core.info(tags.toString());
  const git = new github.GitHub(token);

  core.info(JSON.stringify(getByTag(git, tags[0])));
} catch (error) {
  core.error(error.toString());
  core.setFailed(error.change.toString());
}
