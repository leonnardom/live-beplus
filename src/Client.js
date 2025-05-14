const { Client, Options, Partials } = require('discord.js');
const {
  EventLoader,
  CommandLoader,
  DatabaseLoader,
  FunctionLoader
} = require('./loaders');

module.exports = class BotLive extends Client {
  constructor() {
    super({
      intents: 33283,
      shardCount: 1,
      restTimeOffset: 0,
      failIfNotExists: false,
      partials: [Partials.Message, Partials.Channel],
      allowedMentions: { parse: ['users', 'roles'], repliedUser: true },
      makeCache: Options.cacheWithLimits({
        StageInstanceManager: 0,
        ThreadMemberManager: 0,
        GuildBanManager: 0,
        ApplicationCommandManager: 0,
        ApplicationCommandPermissionsManager: 0,
        GuildApplicationCommandManager: 0,
        GuildEmojiRoleManager: 0,
        GuildInviteManager: 0
      })
    });

    this.developers = ['600804786492932101'];
  }

  login() {
    super.login(process.env.TOKEN);
  }

  initializeLoaders() {
    new CommandLoader(this).call({ dir: 'commands' });
    new EventLoader(this).call();
    new DatabaseLoader(this).call();
    new FunctionLoader(this).call();

    return this;
  }
};
