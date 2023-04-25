'use strict';
const {
  Model: Model20
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Notification extends Model20 {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      // console.log(models)
      (models.notification).belongsTo(models.users);
      (models.notification).belongsTo(models.users, {
        foreignKey: 'actionByUserId'
      });
    }
  }
  Notification.init({
    comment: DataTypes.STRING,
    status: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'notification',
  });
  return Notification;
};