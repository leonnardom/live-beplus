const { StringSelectMenuBuilder, ActionRowBuilder } = require('discord.js');
const { Command, ClientEmbed, Emojis } = require('../../');

module.exports = class HelpCommand extends Command {
  constructor(client) {
    super(
      {
        name: 'ajuda',
        aliases: ['help'],
        category: 'Bot',

        hidden: false,
        description: 'Painel de Ajuda do Bot',
        usage: 'ajuda [comando]',

        Permissions: [],
        UserPermissions: ['ManageGuild'],

        options: [
          {
            type: 3,
            name: 'comando',
            description: 'Nome do Comando.',
            required: false
          }
        ],

        utils: { devNeed: false }
      },
      client
    );
  }

  async run({ message }, args) {
    if (!message.member.permissions.has('ManageGuild')) return;

    if (message.type != 2) {
      return message.reply({
        content: `${Emojis.Error} ${message.author}, use esse comando em formato de **/** por favor!`,
        ephemeral: true
      });
    }

    const COMMAND = args[0]
      ? this.client.commands
          .filter(cmd => !(cmd.category === 'Developer'))
          .find(
            cmd =>
              cmd.name.toLowerCase() === args.join(' ').toLowerCase() ||
              (cmd.aliases &&
                cmd.aliases.includes(args.join(' ').toLowerCase()))
          )
      : false;

    if (COMMAND) return this.commandHelp(message, COMMAND);

    const commands = this.client.commands;

    const COMMANDS = [];

    const EMBED = new ClientEmbed()
      .setAuthor({
        name: message.author.displayName,
        iconURL: message.author.displayAvatarURL({
          dynamic: true,
          extension: 'png',
          size: 2048
        })
      })
      .setDescription(
        `- Olá ${message.author}, aqui está meu painel de **ajuda** dos **comandos**.\n\n- Selecione alguma **categoria** para saber os **comandos** da mesma.`
      );

    const MENU = new StringSelectMenuBuilder()
      .setCustomId('SelectMenu')
      .setMinValues(1)
      .setMaxValues(1)
      .setPlaceholder(`🖐️ Selecione a Categoria`);

    const OPTIONS = [];

    const listCategory = commands
      .map(x => x.category)
      .filter((x, f, y) => y.indexOf(x) === f && x != 'Developer');

    listCategory.forEach(async category => {
      const commandsList = commands
        .filter(x => x.category === category)
        .sort((a, b) => a.name.localeCompare(b.name))
        .map(f => ` - \`${f.name}\` - ${f.description}`);

      OPTIONS.push({
        label: `${this.replaceCategories(category)} [${commandsList.length}]`,
        value: category
        // emoji: EMOJI
      });

      COMMANDS.push({
        commands: commandsList || `Nenhum Comando`,
        value: category
      });
    });

    OPTIONS.push({
      label: `Voltar`,
      value: `back`
      // emoji: "795763386859257897",
    });

    COMMANDS.push({
      commands: '',
      value: 'back'
    });

    MENU.setOptions(OPTIONS);

    const row = new ActionRowBuilder().setComponents([MENU]);

    const msg = await message.reply({
      embeds: [EMBED],
      components: [row],
      fetchReply: true,
      ephemeral: true
    });

    const filter = interaction => {
      return (
        interaction.isStringSelectMenu() && interaction.message.id === msg.id
      );
    };

    message.channel
      .createMessageComponentCollector({
        time: 60000 * 5,
        filter: filter
      })

      .on('collect', async r => {
        if (r.user.id !== message.author.id)
          return r.reply({
            content: `${Emojis.Error} | ${r.user}, você não usou o comando.`,
            ephemeral: true
          });

        const { value, commands } = COMMANDS.find(v => v.value === r.values[0]);

        EMBED.data.fields = [];

        if (value == 'back')
          EMBED.setDescription(
            `- Olá ${message.author}, aqui está meu painel de **ajuda** dos **comandos**.\n\n- Selecione alguma **categoria** para saber os **comandos** da mesma.`
          );
        else
          EMBED.setDescription(
            `- ${Emojis.Loading} ${
              message.author
            }, comandos da categoria **${this.replaceCategories(
              value
            )}**.\n\n- Lista dos Comandos:\n${commands.join('\n')}`
          );

        await message.webhook.editMessage(msg, { embeds: [EMBED] }, true);

        await r.deferUpdate();
      });
  }

  async commandHelp(message, command) {
    const { UserPermissions, Permissions, aliases, name, description } =
      command;

    const EMBED = new ClientEmbed()
      .setTitle(name)
      .setDescription(description || 'Sem descrição definida.')
      .addFields([
        {
          name: `Aliases`,
          value: `- ${aliases.length ? aliases.join(', ') : `Nenhuma`}`
        },
        {
          name: `Minha Permissões`,
          value: `- ${
            Permissions.length
              ? Permissions.map(perm => `${perm}`).join(', ')
              : `Não preciso de nenhuma permissão para rodar o comando.`
          }`
        },
        {
          name: `Permissões do Usuário`,
          value: `- ${
            UserPermissions.length
              ? UserPermissions.map(perm => `${perm}`).join(', ')
              : `Usuário não precisa de nenhuma permissão para usar o comando.`
          }`
        }
      ]);

    const reference = command.reference;

    if (reference) {
      const subCommands = this.client.subcommands.get(reference);

      if (subCommands.size >= 1)
        EMBED.addFields([
          {
            name: `Sub-Comandos`,
            value: `- ${Array.from(subCommands)
              .map(([, x]) => x.name)
              .join(', ')}`
          }
        ]);
    }

    return message.reply({
      content: `${message.author}`,
      embeds: [EMBED],
      ephemeral: true
    });
  }

  replaceCategories(category) {
    let categoryName;

    switch (category) {
      case 'Administrator':
        categoryName = 'Administração';

        break;

      case 'Economy':
        categoryName = 'Economia';

        break;

      case 'Fun':
        categoryName = 'Diversão';

        break;

      case 'Miscellaneous':
        categoryName = 'Sem Definição';

        break;

      case 'Music':
        categoryName = 'Música';

        break;

      case 'Utils':
        categoryName = 'Utilitários';

        break;

      case 'Moderation':
        categoryName = 'Moderação';

        break;

      default:
        categoryName = category;
    }

    return categoryName;
  }
};
