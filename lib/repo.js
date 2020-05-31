const CLUI = require("clui");
const fs = require("fs");
const git = require("simple-git/promise")();
const Spinner = CLUI.Spinner;
const touch = require("touch");
const _ = require("lodash");

const inquirer = require("./inquirer");
const gh = require("./github");

module.exports = {
  createRemoteRepo: async () => {
    const github = gh.getInstance();
    const answers = await inquirer.askForRepoDetails();
    const data = {
      name: answers.name,
      description: answers.description,
      private: answers.vibility === "private",
    };
    const status = new Spinner("Creating remote repo...");
    status.start();
    try {
      const res = await github.repos.createForAuthenticatedUser(data);
      return res.data.ssh_url;
    } finally {
      status.stop();
    }
  },
  createGitignore: async () => {
    const fileList = _.without(fs.readdirSync("."), ".git", ".gitignore");
    if (fileList.length) {
      const answers = await inquirer.askForIgnoreFiles(fileList);
      if (answers.ignore.length) {
        fs.writeFileSync("./.gitignore", answers.ignore.join("\n"));
      } else {
        touch(".gitignore");
      }
    } else {
      touch(".gitignore");
    }
  },
  setupRepo: async (url) => {
    const status = new Spinner(
      "Initializing local repository; pushing to remore version control.."
    );
    status.start();
    try {
      git
        .init()
        .then(git.add(".gitignore"))
        .then(git.add("./*"))
        .then(git.commit("Initial commit"))
        .then(git.addRemote("origin", url))
        .then(git.push("origin", "master"));
    } finally {
      status.stop();
    }
  },
};
