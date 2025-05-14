const { Command, Emojis } = require('../..');
const { resolve } = require('path');
const fs = require('fs').promises;

module.exports = class ReloadCommand extends Command {
  constructor(client) {
    super(
      {
        name: 'reload',
        aliases: ['r'],
        category: 'Developer',

        hidden: true,
        description: 'Recarrega comandos e suas funções.',
        usage: 'reload <command>',

        Permissions: [],
        UserPermissions: [],

        utils: { devNeed: true },

        options: [
          {
            type: 3,
            name: 'comando',
            description: 'Nome do comando para reiniciar.',
            required: true
          }
        ]
      },
      client
    );
  }

  async findUtilFile(utilName) {
    try {
      const utilsPath = resolve(__dirname, '../../utils');
      const files = await fs.readdir(utilsPath);

      for (const file of files) {
        if (!file.endsWith('.js')) continue;

        const fileName = file.replace('.js', '').toLowerCase();
        if (fileName === utilName.toLowerCase()) {
          const filePath = resolve(utilsPath, file);
          return {
            path: filePath,
            originalName: file.replace('.js', '')
          };
        }
      }
      return null;
    } catch (err) {
      console.error(`Erro ao procurar arquivo de utilidade: ${err}`);
      return null;
    }
  }

  async findCommandFile(cmdName, category) {
    try {
      // Caminho base para a categoria
      const categoryPath = resolve(__dirname, '..', category);

      // Lista todos os arquivos da categoria
      const files = await fs.readdir(categoryPath);

      // Procura por um arquivo que corresponda ao comando
      for (const file of files) {
        if (!file.endsWith('.js')) continue;

        const commandPath = resolve(categoryPath, file);
        // Limpa o cache para reload
        delete require.cache[require.resolve(commandPath)];

        // Carrega o comando temporariamente para verificar
        const tempCommand = new (require(commandPath))(this.client);

        // Verifica se é o comando que procuramos (pelo nome ou aliases)
        if (
          tempCommand.name === cmdName ||
          tempCommand.aliases?.includes(cmdName)
        ) {
          return {
            path: commandPath,
            originalName: file.replace('.js', ''),
            command: tempCommand
          };
        }
      }

      return null;
    } catch (err) {
      console.error(`Erro ao procurar comando: ${err}`);
      return null;
    }
  }

  async run({ message }, args) {
    if (message.author.id !== process.env.OWNER_ID) return;

    const name = args[0].toLowerCase();

    // Continua com o reload normal de comandos
    const cmd = this.client.commands.find(
      c => c.name === name || c.aliases?.includes(name)
    );

    if (!cmd) {
      return message.reply(
        `${Emojis.Error} - ${message.author}, o comando **${name}** não foi encontrado.`
      );
    }

    try {
      // Procura o arquivo do comando na categoria correta
      const commandFile = await this.findCommandFile(name, cmd.category);

      if (!commandFile) {
        return message.reply(
          `${Emojis.Error} - ${message.author}, não foi possível encontrar o arquivo do comando **${name}**.`
        );
      }

      // Carrega o novo comando
      const newCommand = new (require(commandFile.path))(this.client);
      this.client.commands.set(commandFile.command.name, newCommand);

      message.reply(
        `${Emojis.Success} - ${message.author}, comando **${cmd.name}** (arquivo: ${commandFile.originalName}.js) recarregado com sucesso.`
      );
    } catch (err) {
      message.reply(
        `${Emojis.Error} - ${message.author}, erro ao recarregar o comando **${cmd.name}**.\n- \`${err.message}\``
      );
    }
  }
};
