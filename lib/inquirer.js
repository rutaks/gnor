const inquirer = require("inquirer");

module.exports = {
  askForGithubCreds: () => {
    const questions = [
      {
        name: "username",
        type: "input",
        message: "Enter your Github username or e-mail: ",
        validate: function (value) {
          if (value.length) {
            return true;
          } else {
            return "Enter A valid username or e-mail";
          }
        },
      },
      {
        name: "password",
        type: "password",
        message: "Enter your password: ",
        validate: function (value) {
          if (value.length) {
            return true;
          } else {
            return "Enter your password";
          }
        },
      },
    ];
    return inquirer.prompt(questions);
  },
};
