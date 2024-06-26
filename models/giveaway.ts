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
    caption: DataTypes.TEXT,
    media: DataTypes.STRING,
    mediaType: DataTypes.STRING,
    hashtags: DataTypes.TEXT,
    country: DataTypes.STRING,
    status: DataTypes.INTEGER,
    views: DataTypes.INTEGER,
    default: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    }
  }, {
    sequelize,
    modelName: 'giveaway',
  });
  return giveaway;
};