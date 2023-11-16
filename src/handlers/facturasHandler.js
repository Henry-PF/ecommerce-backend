const FacturaController = require('../controllers/facturaController');

const FacturaHandler = {
  listarFacturas: async (req, res) => {
    try {
      await FacturaController.listarFacturas(req, res);
    } catch (error) {
      res.status(500).json({ error: 'Error en el handler al listar las facturas' });
    }
  },

  crearFactura: async (req, res) => {
    try {
      const nuevaFactura = await FacturaController.crearFactura(req.body);
      res.status(201).json(nuevaFactura);
    } catch (error) {
      res.status(500).json({ error: 'Error al crear la factura desde el handler' });
    }
  },

  actualizarFactura: async (req, res) => {
    try {
      const facturaActualizada = await FacturaController.actualizarFactura(req.params.id, req.body);
      res.status(200).json(facturaActualizada);
    } catch (error) {
      res.status(500).json({ error: 'Error al actualizar la factura desde el handler' });
    }
  },

  eliminarFactura: async (req, res) => {
    try {
      await FacturaController.eliminarFactura(req.params.id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: 'Error al eliminar la factura desde el handler' });
    }
  },

};

module.exports = FacturaHandler;
