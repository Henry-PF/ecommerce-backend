const { Op } = require('sequelize');
const { producto, categoria } = require('../db.js');

exports.buscarProductos = async (datos) => {
    try {
        const { nombre, categoriaId, precioMin, precioMax } = datos;

        const filtro = {
            nombre: {
                [Op.like]: `%${nombre}%`,
            },
        };

        if (categoriaId) {
            filtro.categoriaId = categoriaId;
        }

        if (precioMin && precioMax) {
            filtro.precio = {
                [Op.between]: [precioMin, precioMax],
            };
        } else if (precioMin) {
            filtro.precio = {
                [Op.gte]: precioMin,
            };
        } else if (precioMax) {
            filtro.precio = {
                [Op.lte]: precioMax,
            };
        }

        const productos = await producto.findAll({
            where: filtro,
            include: [
                {
                    model: categoria,
                    attributes: ['nombre'],
                },
            ],
        });

        res.json(productos);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al buscar productos.' });
    }
};
