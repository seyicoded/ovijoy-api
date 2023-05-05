'use strict';
const {
  Model: Model29
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class staffrole extends Model29 {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      // (models.staffrole).belongsToMany(models.users);
    }
  }
  staffrole.init({
    role: DataTypes.STRING,
    status: DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'staffrole',
  });
  return staffrole;
};