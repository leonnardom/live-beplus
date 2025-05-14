const { EmbedBuilder } = require('discord.js');

module.exports = class ClientEmbed extends EmbedBuilder {
  constructor(user) {
    super(user);

    this.setColor(process.env.EMBED_COLOR);
  }
};
