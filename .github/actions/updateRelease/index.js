const core = require("@actions/core");
const github = require("@actions/github");

class GithubReleases {
  git;
  logs;
  tags;

  constructor(token, tags, logs) {
    this.git = new github.GitHub(token);
    this.tags = tags;
    this.logs = logs;
  }

  createRelease(tag) {
    const packageName = Object.keys(this.logs).filter(
      t => tag.indexOf(t) > -1
    )[0];

    return this.git.repos.createRelease({
      body: this.logs[packageName],
      name: tag,
      owner: github.context.repo.owner,
      repo: github.context.repo.repo,
      tag_name: tag
    });
  }

  publishReleases() {
    this.tags.forEach(tag =>
      this.createRelease(tag).then(
        () => {
          core.info(`Release for ${tag} published successfully`);
        },
        error => {
          throw new Error(JSON.stringify(error));
        }
      )
    );
  }
}

const run = () => {
  try {
    const tags = core.getInput("tags").split(",");
    const token = core.getInput("token");
    const changesRaw = core.getInput("changes");

    const changes = JSON.parse(changesRaw);

    const gitReleases = new GithubReleases(token, tags, changes.logEntries);

    gitReleases.publishReleases();
  } catch (error) {
    core.setFailed(error);
  }
};

run();
