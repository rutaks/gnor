#!/usr/bin/env node
const chalk = require("chalk");
const clear = require("clear");
const figlet = require("figlet");

const files = require("./lib/files");
const github = require("./lib/github");
const repo = require("./lib/repo");

clear();

console.log(chalk.green(figlet.textSync("GNOR", { horizontalLayout: "full" })));

const getGithubToken = async () => {
  let token = github.getStoredAccessToken();
  if (token) return token;
  token = github.getPersonalAccessToken();
  return token;
};

const run = async () => {
  try {
    const token = await getGithubToken();
    github.githubAuth(token);
    const url = await repo.createRemoteRepo();
    await repo.createGitignore();
    await repo.setupRepo(url);
    console.log(chalk.green("You're all set :)"));
  } catch (error) {
    if (!error) {
      console.log(chalk.red("Could not set up repo :("));
      return;
    }
    switch (error.status) {
      case 401:
        console.log(
          chalk.red("Could not log you in. Provide correct credentials")
        );
        break;
      case 422:
        console.log(chalk.red("A repo with the same already exists"));
      default:
        console.log(chalk.red(error));
        break;
    }
  }
};

run();
