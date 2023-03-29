'use strict';
const {
  Model: Model9
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class likes extends Model9 {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      (models.likes).belongsTo(models.users);
      (models.likes).belongsTo(models.post);
      (models.likes).belongsTo(models.status);
      (models.likes).belongsTo(models.comments);
    }
  }
  likes.init({
    active: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'likes',
  });
  return likes;
};