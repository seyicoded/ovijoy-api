'use strict';
const {
  Model: Model5
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class category extends Model5 {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      (models.category).hasMany(models.post);
      (models.category).hasMany(models.status);
      (models.category).hasMany(models.giveaway);
    }
  }
  category.init({
    name: DataTypes.STRING,
    status: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'category',
  });
  return category;
};