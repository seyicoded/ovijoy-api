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
      (models.giveaway).belongsTo(models.users);
      (models.giveaway).belongsTo(models.category);
      (models.giveaway).hasMany(models.likes);
      (models.giveaway).hasMany(models.comments);
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