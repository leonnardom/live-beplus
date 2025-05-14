const { Command, Emojis } = require('../../');

module.exports = class UptimeCommand extends Command {
  constructor(client) {
    super(
      {
        name: 'uptime',
        aliases: ['online'],
        category: 'Bot',

        hidden: false,
        description: 'Informação de Tempo online do Bot.',
        usage: 'uptime',

        Permissions: [],
        UserPermissions: [],

        utils: { devNeed: false }
      },
      client
    );
  }

  async run({ message }) {
    message.reply(
      `${Emojis.Loading} | ${message.author}, estou acordado há **${this.getTime(
        this.convertMilliseconds(process.uptime() * 1000)
      )
        .replace('days', 'dias')
        .replace('day', 'dia')
        .replace('hours', 'horas')
        .replace('hour', 'hora')
        .replace('minutes', 'minutos')
        .replace('minute', 'minuto')
        .replace('seconds', 'segundos')
        .replace('second', 'segundo')
        .replace('and', 'e')}**`
    );
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
