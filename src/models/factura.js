'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class compra extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.usuarios,{ foreignKey: "id_usuario"});
      this.belongsTo(models.statud,{ foreignKey: "id_statud"});
      this.hasMany(models.pagos,{ foreignKey: "id_factura"});
      this.hasMany(models.factura_detalle,{ foreignKey: "id_factura"});
    }
  }
  compra.init({
    id:{
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
      unique: true,
    },
    total: {
      type: DataTypes.DOUBLE,
      allowNull: false,
    },
  }, {
    sequelize,
    modelName: 'factura',
  });
  return compra;
};