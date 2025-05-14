const CommandContext = require('../../structures/CMD/CommandContext');

const GET_PREFIX = (message, PREFIXES) => {
  let verify = PREFIXES.some(Prefix => message.content.startsWith(Prefix));
  return verify
    ? PREFIXES.find(Prefix => message.content.startsWith(Prefix))
    : false;
};

const MENTIONS = (PREFIXES, id) => {
  for (const value of [`<@!${id}>`, `<@${id}>`]) PREFIXES.push(value);
};

const GET_MENTION = id => {
  return new RegExp(`^<@!?${id}>( |)$`);
};

module.exports = class Message {
  constructor(client) {
    this.client = client;
  }

  async ON(message) {
    if (!this.client.database.guilds || message.author.bot) return;

    const guild = message.guild?.id;

    const { prefix } = await this.client.database.guilds.findOne({
      _id: guild
    });

    const PREFIXES = [prefix];

    await MENTIONS(PREFIXES, this.client.user.id);
    const PREFIX = await GET_PREFIX(message, PREFIXES);

    if (!PREFIX) return;

    if (message.content.match(await GET_MENTION(this.client.user.id)))
      message.reply({ content: `Olá, meu prefixo é \`${prefix}\`` });

    if (PREFIX && message.content.length > PREFIX.length) {
      const args = message.content.slice(PREFIX.length).trim().split(/ +/g);
      const cmd = args.shift().toLowerCase();

      const command = this.client.commands.find(
        c => c.name === cmd || (c.aliases && c.aliases.includes(cmd))
      );

      if (!command) return;

      const context = new CommandContext({
        client: this.client,
        author: message.author,
        message,
        command,
        prefix: PREFIX
      });

      command._run(context, args);
    }
  }
};
