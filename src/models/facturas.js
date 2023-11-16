'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Factura extends Model {
    static associate(models) {
      // Definir las relaciones con otros modelos
      Factura.belongsTo(models.Cliente, { foreignKey: 'clienteId' });
    }

    static obtenerTodas() {
      return this.findAll(); // Obtener todas las facturas
    }

    static obtenerPorId(id) {
      return this.findByPk(id); // Obtener una factura por su ID
    }

    static crearNueva(facturaData) {
      return this.create(facturaData); // Crear una nueva factura
    }

    static actualizarPorId(id, facturaData) {
      return this.update(facturaData, { where: { id } }); // Actualizar una factura por su ID
    }

    static eliminarPorId(id) {
      return this.destroy({ where: { id } }); // Eliminar una factura por su ID
    }
  }

  Factura.init({
    numero: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
      unique: true,
    },
    total: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    // Otros campos de la factura
  }, {
    sequelize,
    modelName: 'Factura',
  });

  return Factura;
};
