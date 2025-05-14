const MongoRepository = require('../MongoRepository.js');
const CommandSchema = require('../schemas/CommandSchema.js');

module.exports = class CommandRepository extends MongoRepository {
  constructor(mongoose) {
    super(mongoose, mongoose.model('Command', CommandSchema));
  }

  parse(entity) {
    return {
      // <---------- ID ----------> \\

      _id: null,

      // <---------- Usages ----------> \\

      usages: 0,

      // <---------- Maintenance ----------> \\

      maintenance: {
        status: false,
        reason: null
      },
      ...(super.parse(entity) || {})
    };
  }
};
