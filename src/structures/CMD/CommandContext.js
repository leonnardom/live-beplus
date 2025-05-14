module.exports = class CommandContext {
  constructor(options = {}) {
    this.client = options.client;

    this.command = options.command;
    this.message = options.message;
    this.prefix = options.prefix

    this.author = this.message.author;
    this.guild = this.message.guild;

    this.channel = this.message.channel;
  }
};
