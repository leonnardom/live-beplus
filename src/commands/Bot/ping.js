const { Command } = require('../..');

module.exports = class PingCommand extends Command {
  constructor(client) {
    super(
      {
        name: 'ping',
        aliases: [],
        category: 'Bot',

        hidden: false,
        description: 'Ping do Bot',
        usage: 'ping',

        Permissions: [],
        UserPermissions: ['ManageGuild'],

        utils: { devNeed: false }
      },
      client
    );
  }

  async run({ message }, args) {
    const start = process.hrtime();

    await this.client.database.users
      .findOne({ _id: message.author.id })
      .then(x => x.coins);

    const stop = process.hrtime(start);

    const pingDB = Math.round((stop[0] * 1e9 + stop[1]) / 1e6) + 'ms';

    message.reply(
      `- Database: **${pingDB}**\n\n- API: **${~~this.client.ws.ping} ms**`
    );
  }
};
