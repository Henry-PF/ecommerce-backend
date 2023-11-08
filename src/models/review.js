'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class review extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.usuarios,{ foreignKey: "id_usuario"});
    }
  }
  review.init({
    id:{
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
      unique: true,
    },
    contenido: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    puntuacion: {
      type: DataTypes.DOUBLE,
      allowNull: false,
    },
  }, {
    sequelize,
    modelName: 'review',
  });
  return review;
};