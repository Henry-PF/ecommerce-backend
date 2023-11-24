'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class usuarios extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.personas,{ foreignKey: "id_persona"});
      this.belongsTo(models.statud,{ foreignKey: "id_statud"});
      this.hasMany(models.carrito,{ foreignKey: "id_usuario"});
      this.hasMany(models.factura,{ foreignKey: "id_usuario"});
      this.hasMany(models.favoritos_productos,{ foreignKey: "id_usuario"});
      this.hasMany(models.review,{ foreignKey: "id_usuario"});
      this.hasMany(models.productsReview,{ foreignKey: "id_usuario"});

    }
  }
  usuarios.init({
    id:{
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
      unique: true,
    },
    usuario: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    googleId:  {
      type: DataTypes.STRING,
      allowNull: false,
    },
  }, {
    sequelize,
    modelName: 'usuarios',
  });
  return usuarios;
};