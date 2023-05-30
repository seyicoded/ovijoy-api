'use strict';
const {
  Model: Model44
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class sharecount extends Model44 {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      (models.sharecount).belongsTo(models.users);
      (models.sharecount).belongsTo(models.post);
      (models.sharecount).belongsTo(models.status);
      (models.sharecount).belongsTo(models.comments);
      (models.sharecount).belongsTo(models.giveaway);
    }
  }
  sharecount.init({
    active: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'sharecount',
  });
  return sharecount;
};