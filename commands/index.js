const fs = require("fs");
const path = require("path");

const commands = [];

const commandFiles = fs.readdirSync(__dirname).filter(file => file.endsWith(".js") && file !== "index.js");

for (const file of commandFiles) {
  const command = require(path.join(__dirname, file));
  if (command.data && command.execute) {
    commands.push(command);
  }
}

module.exports = commands;