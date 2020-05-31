const chalk = require("chalk");
const clear = require("clear");
const figlet = require("figlet");

const files = require("./lib/files");

clear();

console.log(
  chalk.yellow(figlet.textSync("GNOR", { horizontalLayout: "full" }))
);

if (files.directoryExists(".git")) {
  console.log(chalk.red("A Git Repo Already Exists!"));
  process.exit();
}
