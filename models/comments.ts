'use strict';
const {
  Model: Model8
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class comments extends Model8 {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      (models.comments).belongsTo(models.users);
      (models.comments).belongsTo(models.post);
      (models.comments).belongsTo(models.giveaway);
      (models.comments).belongsTo(models.status);
      (models.comments).hasMany(models.likes);
      (models.comments).hasMany(models.comments, {as: 'commentHost'});
    }
  }
  comments.init({
    comment: DataTypes.STRING,
    active: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'comments',
  });
  return comments;
};