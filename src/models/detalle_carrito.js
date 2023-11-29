'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class detalle_carrito extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.carrito, { foreignKey: "id_carrito" });
      this.belongsTo(models.producto, { foreignKey: "id_producto" });
    }
  }
  detalle_carrito.init({
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
      unique: true,
    },
    cantidad: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    subtotal: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
  }, {
    sequelize,
    modelName: 'detalle_carrito',
  });
  return detalle_carrito;
};