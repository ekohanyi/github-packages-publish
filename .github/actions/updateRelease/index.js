const core = require("@actions/core");
const github = require("@actions/github");

// const getByTag = (git, tag) => {
//   console.log(git.repos.getReleaseByTag);
//   console.log(tag);
//   console.log(github.context.repo.owner);
//   console.log(github.context.repo.repo);
//   return git.repos.getReleaseByTag({
//     owner: github.context.repo.owner,
//     repo: github.context.repo.repo,
//     tag: tag
//   });
// };

const createRelease = (git, tag, logs) => {
  console.log(logs);
  return git.repos.createRelease({
    body: "sup",
    name: tag,
    owner: github.context.repo.owner,
    repo: github.context.repo.repo,
    tag_name: tag
  });
};

try {
  const tags = core.getInput("tags").split(",");
  const token = core.getInput("token");
  const changesRaw = core.getInput("changes");
  console.log(changesRaw);
  const changes = JSON.parse(changesRaw);
  console.log(token);
  core.info(tags.toString());
  const git = new github.GitHub(token);

  tags.forEach(tag =>
    core.info(
      JSON.stringify(
        createRelease(git, tag, changes.logEntries).then(
          data => {
            console.log(JSON.stringify(data));
          },
          error => {
            console.log(JSON.stringify(error));
          }
        )
      )
    )
  );
} catch (error) {
  core.error(error.toString());
  core.setFailed(error.change.toString());
}
