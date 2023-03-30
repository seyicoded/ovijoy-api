'use strict';
const {
  Model: Model3
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Status extends Model3 {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      (models.status).belongsTo(models.users);
      (models.status).belongsTo(models.category);
      (models.status).hasMany(models.likes);
      (models.status).hasMany(models.comments);
    }
  }
  Status.init({
    caption: DataTypes.STRING,
    media: DataTypes.STRING,
    mediaType: DataTypes.STRING,
    hashtags: DataTypes.STRING,
    country: DataTypes.STRING,
    status: DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'status',
  });
  return Status;
};