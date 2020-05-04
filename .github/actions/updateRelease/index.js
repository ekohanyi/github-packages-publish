const core = require("@actions/core");
const github = require("@actions/github");

const getByTag = (git, tag) => {
  console.log(git.repos.getReleaseByTag);
  console.log(tag);
  console.log(github.context.repo.owner);
  console.log(github.context.repo.repo);
  return git.repos.getReleaseByTag({
    owner: github.context.repo.owner,
    repo: github.context.repo.repo,
    tag: tag
  });
};

const createRelease = (git, tag, name, body) => {
  return git.repos.createRelease({
    body: body,
    name: name,
    repo: github.context.repo.repo,
    tag_name: tag
  });
};

try {
  const tags = core.getInput("tags").split(",");
  const token = core.getInput("token");
  console.log(token);
  core.info(tags.toString());
  const git = new github.GitHub(token);

  core.info(
    JSON.stringify(
      getByTag(git, tags[0]).then(
        data => {
          console.log(data);
          return data;
        },
        () => {
          createRelease(git, tags[0], "hello", "this is the body text").then(
            data => {
              console.log(JSON.stringify(data));
            },
            error => {
              console.log(JSON.stringify(error));
            }
          );
        }
      )
    )
  );
} catch (error) {
  core.error(error.toString());
  core.setFailed(error.change.toString());
}
