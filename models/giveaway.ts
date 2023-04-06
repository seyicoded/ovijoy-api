'use strict';
const {
  Model: Model15
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class giveaway extends Model15 {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  giveaway.init({
    caption: DataTypes.STRING,
    media: DataTypes.STRING,
    mediaType: DataTypes.STRING,
    hashtags: DataTypes.STRING,
    country: DataTypes.STRING,
    status: DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'giveaway',
  });
  return giveaway;
};