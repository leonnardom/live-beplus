const { Command } = require('../..');

module.exports = class EvalCommand extends Command {
  constructor(client) {
    super(
      {
        name: 'eval',
        aliases: ['ex', 'execute', 'e'],
        category: 'Developer',

        hidden: true,
        description: 'Teste comandos e códigos!',
        usage: 'eval <código>',

        Permissions: [],
        UserPermissions: [],

        utils: { devNeed: true }
      },
      client
    );
  }

  async run({ message }, args) {
    try {
      let evaled = eval(args.join(' '));

      if (typeof evaled !== 'string') {
        evaled = require('util').inspect(evaled, { depth: 0 });
      }

      if (evaled === this.client.token) return;

      await message.reply({
        content: '```js\n' + evaled + '```'
      });
    } catch (e) {
      message.reply(e.message);
    }
  }
};
