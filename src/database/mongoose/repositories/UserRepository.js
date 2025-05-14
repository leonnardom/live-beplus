const MongoRepository = require('../MongoRepository.js');
const UserSchema = require('../schemas/UserSchema.js');

module.exports = class UserRepository extends MongoRepository {
  constructor(mongoose) {
    super(mongoose, mongoose.model('Users', UserSchema));
  }

  parse(entity) {
    return {
      // <---------- ID ----------> \\

      _id: null,

      // <---------- Coins ----------> \\

      coins: 0,

      // <---------- Event Coins ----------> \\

      event: 0,

      // <---------- Inventory ----------> \\

      inventory: {},

      // <---------- XP ----------> \\

      xp: {
        level: 1,
        exp: 0
      },

      // <---------- Warns ----------> \\

      warns: 0,

      ...(super.parse(entity) || {})
    };
  }
};
