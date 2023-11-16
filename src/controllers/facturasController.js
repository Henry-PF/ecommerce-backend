const FacturaModel = require('../models/facturaModel');

const FacturaController = {
  listarFacturas: async (req, res) => {
    try {
      const facturas = await FacturaModel.obtenerFacturas();
      res.status(200).json(facturas);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener las facturas desde el controlador' });
    }
  },

  crearFactura: async (facturaData) => {
    try {
      // Lógica para crear una nueva factura en el modelo
      return await FacturaModel.create(facturaData);
    } catch (error) {
      throw new Error('Error al crear la factura desde el controlador');
    }
  },

  actualizarFactura: async (id, facturaData) => {
    try {
      // Lógica para actualizar una factura existente en el modelo
      const factura = await FacturaModel.findByPk(id);
      if (!factura) {
        throw new Error('Factura no encontrada');
      }
      return await factura.update(facturaData);
    } catch (error) {
      throw new Error('Error al actualizar la factura desde el controlador');
    }
  },

  eliminarFactura: async (id) => {
    try {
      // Lógica para eliminar una factura existente en el modelo
      const factura = await FacturaModel.findByPk(id);
      if (!factura) {
        throw new Error('Factura no encontrada');
      }
      await factura.destroy();
    } catch (error) {
      throw new Error('Error al eliminar la factura desde el controlador');
    }
  },
};

module.exports = FacturaController;
