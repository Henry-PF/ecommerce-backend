const express = require('express');
const router = express.Router();
const FacturaHandler = require('../handlers/facturaHandler');

// Rutas para las operaciones CRUD de las facturas
router.get('/', FacturaHandler.listarFacturas); // Obtener todas las facturas
router.post('/', FacturaHandler.crearFactura); // Crear una nueva factura
router.put('/:id', FacturaHandler.actualizarFactura); // Actualizar una factura existente
router.delete('/:id', FacturaHandler.eliminarFactura); // Eliminar una factura

module.exports = router;
