const { Schema } = require('mongoose');

module.exports = new Schema({
  // <---------- ID ----------> \\

  _id: { type: String },

  // <---------- Coins ----------> \\

  coins: { type: Number, default: 0 },

  // <---------- Event Coins ----------> \\

  event: { type: Number, default: 0 },

  // <---------- Inventory ----------> \\

  inventory: { type: Map, default: {} },

  // <---------- XP ----------> \\

  xp: {
    level: { type: Number, default: 1 },
    exp: { type: Number, default: 0 },
    cooldown: { type: Number, default: 0 }
  },

  // <---------- Playlist ----------> \\

  playlists: { type: Map, default: {} },

  // <---------- Invites ----------> \\

  invites: {
    users: { type: Number, default: 0 },
    leaves: { type: Number, default: 0 },
    fakes: { type: Number, default: 0 }
  },

  listUsers: { type: Array, default: [] },

  invitedBy: { type: String, default: null },

  // <---------- Warns ----------> \\

  warns: { type: Number, default: 0 },

  // <---------- Coins Give ----------> \\

  cooldowns: {
    chat: { type: Number, default: 0 },
    voice: { type: Number, default: 0 }
  },

  // <---------- Characters ----------> \\

  characters: {
    list: { type: Array, default: [] }
  },

  // <---------- Points Usage ----------> \\

  usagePoints: { type: Number, default: 0 },

  // <---------- Time Call ----------> \\

  call: { type: Number, default: 0 },

  infoCall: {
    last: { type: Number, default: 0 },
    total: { type: Number, default: 0 }
  },

  // <---------- Messages ----------> \\

  messages: { type: Number, default: 0 },

  // <---------- Email ----------> \\

  email: { type: String, default: null },

  // <---------- Achievements ----------> \\

  achievements: { type: Map, default: {} },

  // <---------- Title ----------> \\

  titles: {
    list: { type: Map, default: {} },
    actual: { type: String, default: null }
  }
});
