const { Command, Emojis } = require('../..');

module.exports = class TestCommand extends Command {
  constructor(client) {
    super(
      {
        name: 'test',
        aliases: ['t'],
        category: 'Developer',
        hidden: true,
        description: 'Teste comandos e suas funções.',
        usage: 'test <UUID>',
        Permissions: [],
        UserPermissions: [],
        utils: { devNeed: true }
      },
      client
    );
  }

  async run({ message }, args) {

    message.reply(`${Emojis.Test} Testando...`);

  }
};
