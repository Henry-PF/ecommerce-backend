'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class statud extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.hasMany(models.usuarios,{ foreignKey: "id_statud"});
      this.hasMany(models.producto,{ foreignKey: "id_statud"});
      this.hasMany(models.categoria,{ foreignKey: "id_statud"});
      this.hasMany(models.carrito,{ foreignKey: "id_statud"});
      this.hasMany(models.factura,{ foreignKey: "id_statud"});
    }
  }
  statud.init({
    id:{
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
      unique: true,
    },
    nombre:  {
      type: DataTypes.STRING,
      allowNull: false,
    },
    tipo:  {
      type: DataTypes.STRING,
      allowNull: false,
    },
  }, {
    sequelize,
    modelName: 'statud',
  });
  return statud;
};