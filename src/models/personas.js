'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class personas extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.hasMany(models.usuarios,{ foreignKey: "id_persona"});
    }
  }
  personas.init({
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
    apellido:  {
      type: DataTypes.STRING,
      allowNull: false,
    },
    correo:  {
      type: DataTypes.STRING,
      allowNull: false,
    },
    telefono:  {
      type: DataTypes.STRING,
      allowNull: false,
    },
    direccion:  {
      type: DataTypes.STRING,
      allowNull: false,
    },
    dni:  {
      type: DataTypes.STRING,
      allowNull: false,
    }
  }, {
    sequelize,
    modelName: 'personas',
  });
  return personas;
};