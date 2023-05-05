'use strict';
const {
  Model: Model30
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class giveawaywinner extends Model30 {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      (models.giveawaywinner).belongsTo(models.users);
    }
  }
  giveawaywinner.init({
    status: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'giveawaywinner',
  });
  return giveawaywinner;
};