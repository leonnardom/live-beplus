const DBWrapper = require('../DBWrapper.js');
const {
  UserRepository,
  CommandRepository,
  GuildRepository
} = require('./repositores.js');

const mongoose = require('mongoose');

module.exports = class MongoDB extends DBWrapper {
  constructor(options = {}) {
    super(options);
    this.mongoose = mongoose;
  }

  async connect() {
    return mongoose.connect(process.env.MONGODB_URI).then(m => {
      this.users = new UserRepository(m);
      this.commands = new CommandRepository(m);
      this.guilds = new GuildRepository(m);
    });
  }
};
