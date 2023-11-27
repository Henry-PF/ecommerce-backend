'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class producto extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.statud, { foreignKey: "id_statud" });
      this.belongsToMany(models.categoria, {
        through: 'producto_categorias',
        foreignKey: 'id_producto',
        otherKey: 'id_categoria'
      });
      this.hasMany(models.img_productos, { foreignKey: "id_producto" });
      this.hasMany(models.detalle_carrito, { foreignKey: "id_producto" });
      this.hasMany(models.favoritos_productos, { foreignKey: "id_producto" });
      this.hasMany(models.productsReview, { foreignKey: "id_producto" });

    }
  }
  producto.init({
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
      unique: true,
    },
    nombre: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    descripcion: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    precio: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    stock: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  }, {
    sequelize,
    modelName: 'producto',
  });
  return producto;
};