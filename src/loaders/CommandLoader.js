const { Collection } = require("discord.js");
const FileUtils = require("../utils/FileUtils");

module.exports = class CommandLoader {
  constructor(client) {
    this.client = client;
    
    this.commands = new Collection();
    this.subcommands = new Collection();
  }

  async call() {
    try {
      await this.loadCommands();

      this.client.commands = this.commands;
      this.client.subcommands = this.subcommands;
    } catch (error) {
      console.log(error);
    }
    console.log(`\x1b[34m[COMMANDS]\x1b[0m`, `Commands loaded successfully.`);
  }

  async loadCommands() {
    FileUtils({ dir: "src/commands" }, (error, Command) => {
      if (error) console.log(error);

      const command = new Command(this.client);

      if (command.subcommand) {
        if (!this.subcommands.get(command.reference)) {
          this.subcommands.set(command.reference, new Collection());
        }
        return this.subcommands
          .get(command.reference)
          .set(command.name, command);
      } else this.commands.set(command.name, command);
    });
  }
};
