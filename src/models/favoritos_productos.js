'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class favoritos_productos extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.producto,{ foreignKey: "id_producto"});
      this.belongsTo(models.usuarios,{ foreignKey: "id_usuario"});
    }
  }
  favoritos_productos.init({
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
      unique: true,
    }
  }, {
    sequelize,
    modelName: 'favoritos_productos',
  });
  return favoritos_productos;
};