const CLUI = require("clui");
const ConfigStore = require("configstore");
const { Octokit } = require("@octokit/rest");
const Spinner = CLUI.Spinner;
const { createBasicAuth } = require("@octokit/auth-basic");

const inquirer = require("./inquirer");
const pkg = require("../package.json");

const config = new ConfigStore(pkg.name);

let octokit;

module.exports = {
  getInstance: () => {
    return octokit;
  },

  getStoredAccessToken: () => {
    return config.get("github.token");
  },

  getPersonalAccessToken: async () => {
    const creds = await inquirer.askForGithubCreds();
    const status = new Spinner("Authenticating you, please wait...");
    status.start();

    const auth = createBasicAuth({
      username: creds.username,
      password: creds.password,
      async on2Fa() {
        status.stop();
        const res = await inquirer.getTwoFactorAuthenticationCode();
        status.start();
        return res.twoFactorAuthenticationCode;
      },
      token: {
        scopes: ["user", "public_repo", "repo", "repo:status"],
        note: "gnor, the online git linking command-line tool ",
      },
    });

    try {
      const res = await auth();
      if (res.token) {
        config.set("github.token", res.token);
        return res.token;
      }
    } finally {
      status.stop();
    }
  },
  githubAuth: (token) => {
    octokit = new Octokit({ auth: token });
  },
};
