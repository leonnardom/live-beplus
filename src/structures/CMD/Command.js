const CommandUtils = require('./CommandUtils');
const ClientEmbed = require('../../utils/ClientEmbed');

const { appendFileSync, mkdirSync, existsSync } = require('fs');

let approved = true;

module.exports = class Command {
  constructor(options = {}, client) {
    this.client = client;
    this.name = options.name;
    this.aliases = options.aliases || [];
    this.category = options.category || 'Nenhuma';
    this.description = options.description || '';
    this.usage = options.usage || '';

    this.Permissions = options.Permissions || ['SendMessages'];
    this.UserPermissions = options.UserPermissions || [];

    this.SubPermissions = options.SubPermissions || [];

    this.options = options.options;

    this.utils = options.utils;

    this.reference = options.reference;

    this.subcommand = options.subcommand;
  }

  async _run(context, args) {
    const { message, command } = context;

    try {
      await this.Database({ context });

      const { maintenance } = await this.client.database.commands.findOne({
        _id: command.name
      });

      if (maintenance.status && message.author.id != process.env.OWNER_ID)
        return message.reply(
          `${message.author}, esse comando se encontra desativado no servidor.\n\n- Motivo: **${maintenance.reason}**`
        );

      const UserNeedPerm = { need: false, perms: [] };
      const SubNeedPerm = { need: false, perms: [] };

      if (command.UserPermissions.length) {
        await this.MemberPermissions({
          perms: command.UserPermissions,
          user: context.author,
          message: message,
          UserNeedPerm
        });
      }

      if (command.SubPermissions.length) {
        await this.SubCommandPermissions({
          perms: command.SubPermissions,
          user: context.author,
          message: message,
          SubNeedPerm
        });
      }

      if (!approved) return;

      await this.ON(context, args);

      await this.run(context, args);
    } catch (e) {
      this.error(context, e);
    }
  }

  async Database({ context }) {
    const { message, command } = context;

    if (!(await this.client.database.users.verify(message.author.id)))
      await this.client.database.users.add({
        _id: message.author.id
      });

    if (!(await this.client.database.guilds.verify(message.guild.id)))
      await this.client.database.guilds.add({
        _id: message.guild.id
      });

    if (!(await this.client.database.commands.verify(command.name)))
      await this.client.database.commands.add({
        _id: command.name
      });

    await this.client.database.commands.update(
      { _id: command.name },
      { $inc: { usages: 1 } }
    );
  }

  async MemberPermissions({
    perms,
    user,
    message,
    UserNeedPerm,
    ERR_USAGE = ''
  }) {
    for (let perm of perms) {
      if (!message.channel.permissionsFor(user).has(perm))
        UserNeedPerm.perms.push(perm);
    }

    if (UserNeedPerm.perms.length >= 1) {
      UserNeedPerm.need = true;
      ERR_USAGE =
        UserNeedPerm.perms.length == 1
          ? 'Você precisa da permissão:'
          : 'Você precisa das permissões:';

      approved = false;

      return message.reply({
        embeds: [
          new ClientEmbed(user)
            .setAuthor({
              name: `${user.username} - Sem Permissão`,
              iconURL: user.displayAvatarURL({ dynamic: true })
            })
            .setDescription(
              `${user}, você não pode usar esse comando.\n\n> ${ERR_USAGE} ${UserNeedPerm.perms
                .map(perm => `**${perm}**`)
                .join(', ')} `
            )
        ]
      });
    } else approved = true;
  }

  async SubCommandPermissions({
    perms,
    user,
    message,
    SubNeedPerm,
    ERR_USAGE = ''
  }) {
    if (!message.member.permissions.has('Administrator')) {
      for (let perm of perms) {
        if (!message.channel.permissionsFor(user).has(perm))
          SubNeedPerm.perms.push(perm);
      }

      if (SubNeedPerm.perms.length >= 1) {
        SubNeedPerm.need = true;
        ERR_USAGE =
          SubNeedPerm.perms.length == 1
            ? 'Você precisa da permissão:'
            : 'Você precisa das permissões:';

        approved = false;

        return message.reply({
          embeds: [
            new ClientEmbed(user)
              .setAuthor({
                name: `${user.username} - Sem Permissão`,
                iconURL: user.displayAvatarURL({ dynamic: true })
              })
              .setDescription(
                `${user}, você não pode usar esse comando.\n\n> ${ERR_USAGE} ${SubNeedPerm.perms
                  .map(perm => `**${perm}**`)
                  .join(', ')} `
              )
          ]
        });
      } else approved = true;
    } else approved = true;
  }

  error({ message, author }, error) {
    if (error.message === 'DEVELOPERS') return;

    const EMBED_USER = new ClientEmbed()
      .setAuthor({
        name: author.displayName,
        iconURL: author.displayAvatarURL({
          extension: 'png',
          size: 2048,
          dynamic: true
        })
      })
      .setDescription(
        `${author}, me desculpa, encontrei um erro ao executar este comando.\n\n> Erro: **${error.message}**`
      )
      .setTimestamp();

    console.log(error);

    return message.reply({ embeds: [EMBED_USER] });
  }

  ON(context, args) {
    return this.utils ? CommandUtils.util(context, this.utils, args) : true;
  }

  msToHour(time) {
    time = Math.round(time / 1000);
    const s = time % 60,
      m = ~~((time / 60) % 60),
      h = ~~(time / 60 / 60);

    return h === 0
      ? `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
      : `${String(Math.abs(h) % 24).padStart(2, '0')}:${String(m).padStart(
          2,
          '0'
        )}:${String(s).padStart(2, '0')}`;
  }

  generateRandomNumber(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);

    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  getTime(time) {
    return (
      Object.entries(time)
        .filter(e => e[1])
        .map(e => [
          e[0].slice(0, -1).padEnd(e[1] > 1 ? e[0].length : 0, 's'),
          e[1]
        ])
        .map((e, i, a) =>
          i === a.length - 1 && a.length > 1
            ? `and ${e[1]} ${e[0]}`
            : i === a.length - 2 || a.length === 1
            ? `${e[1]} ${e[0]}`
            : `${e[1]} ${e[0]},`
        )
        .join(' ') || '0 segundos'
    );
  }

  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  getNewTime(time, style) {
    const TIME = this.convertMilliseconds(time);

    if (!style)
      return TIME.years >= 1
        ? `${TIME.years} anos, ${TIME.months} meses e ${TIME.days} dias`
        : TIME.months >= 1
        ? `${TIME.months} meses, ${TIME.days} dias e ${TIME.hours} horas`
        : TIME.days >= 1
        ? `${TIME.days} dias, ${TIME.hours} horas e ${TIME.minutes} minutos`
        : `${TIME.hours} horas e ${TIME.minutes} minutos`;
    else
      return TIME.years >= 1
        ? `${TIME.years} anos, ${TIME.months} meses e ${TIME.days} dias`
        : TIME.months >= 1
        ? `${TIME.months} meses, ${TIME.days} dias e ${TIME.hours} horas`
        : TIME.days >= 1
        ? `${TIME.days} dias, ${TIME.hours} horas e ${TIME.minutes} minutos`
        : TIME.hours >= 1
        ? `${TIME.hours} horas e ${TIME.minutes} minutos`
        : TIME.minutes >= 1
        ? `${TIME.minutes} minutos e ${TIME.seconds} segundos`
        : `${TIME.seconds} segundos`;
  }

  convertMilliseconds(ms) {
    const seconds = ~~(ms / 1000);
    const minutes = ~~(seconds / 60);
    const hours = ~~(minutes / 60);
    const days = ~~(hours / 24);
    const months = ~~(days / 30);
    const years = ~~(months / 12);

    return {
      years,
      months: months % 12,
      days: days % 30,
      hours: hours % 24,
      minutes: minutes % 60,
      seconds: seconds % 60
    };
  }
};
