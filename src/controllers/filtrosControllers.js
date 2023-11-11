const { Op } = require('sequelize');
const { producto, categoria } = require('../db.js');

exports.buscarProductos = async (datos) => {
    console.log(datos);
    let result = [];
    try {
        const { nombre, categoriaId, precioMin, precioMax } = datos;

        const filtro = {
            nombre: {
                [Op.iLike]: `%${nombre}%`,
            },
        };

        if (categoriaId) {
            // Convertir la cadena de IDs de categorías en un array de números
            const categoriasIds = categoriaId.split(',').map(id => parseInt(id, 10));

            filtro.id_categoria = {
                [Op.in]: categoriasIds,
            };
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

        result = productos;
        console.log(result);
        return result;
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al buscar productos.' });
    }
};
