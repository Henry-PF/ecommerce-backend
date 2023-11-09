'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class pagos extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.statud,{ foreignKey: "id_statud"});
      this.belongsTo(models.factura,{ foreignKey: "id_factura"});
    }
  }
  pagos.init({
    id:{
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
      unique: true,
    },
    ref:{
      type: DataTypes.STRING,
      allowNull: false,
    },
    fecha:  {
      type: DataTypes.STRING,
      allowNull: false,
    },
  }, {
    sequelize,
    modelName: 'pagos',
  });
  return pagos;
};