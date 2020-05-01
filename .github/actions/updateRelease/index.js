import { Context } from "@actions/github/lib/context";
import { GitHub } from "@actions/github";
import * as core from "@actions/core";

const getByTag = tag =>
  this.git.repos.getReleaseByTag({
    owner: this.context.repo.owner,
    repo: this.context.repo.repo,
    tag: tag
  });

try {
  const rawTags = core.getInput("tags");
  core.info(rawTags);
} catch (error) {
  core.error(error.toString());
  core.setFailed(error.change.toString());
}
