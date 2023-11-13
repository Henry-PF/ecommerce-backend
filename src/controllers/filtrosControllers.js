const { Op } = require('sequelize');
const { producto, categoria, img_productos } = require('../db.js');

exports.buscarProductos = async (datos, productsPerPage = 10) => {
    console.log(datos);
    let result = {};
    try {
        const { nombre, categoriaId, precioMin, precioMax } = datos;

        const filtro = {};

        if (nombre) {
            filtro.nombre = {
                [Op.iLike]: `%${nombre}%`,
            };
        }

        if (categoriaId) {
            const categoriasIds = categoriaId.split(',').map(id => parseInt(id, 10));
            filtro.id_categoria = {
                [Op.in]: categoriasIds,
            };
        }
        if (!isNaN(parseFloat(precioMin)) && !isNaN(parseFloat(precioMax))) {
            filtro.precio = {
                [Op.between]: [parseFloat(precioMin), parseFloat(precioMax)],
            };
        } else if (!isNaN(parseFloat(precioMin))) {
            filtro.precio = {
                [Op.gte]: parseFloat(precioMin),
            };
        } else if (!isNaN(parseFloat(precioMax))) {
            filtro.precio = {
                [Op.lte]: parseFloat(precioMax),
            };
        }


        const totalProductos = await producto.count({
            where: filtro,
        });

        const offset = (datos.page - 1) * productsPerPage;

        const productos = await producto.findAll({
            where: filtro,
            include: [
                {
                    model: categoria,
                    attributes: { exclude: ['createdAt', 'updatedAt', 'id'] }
                },
                {
                    model: img_productos,
                    attributes: { exclude: ['createdAt', 'updatedAt', 'id'] }
                }
            ],
            offset,
            limit: productsPerPage,
        });

        if (productos) {
            const totalPages = Math.ceil(totalProductos / productsPerPage);
            result = {
                data: productos,
                totalProductos,
                totalPages,
                error: false,
                message: "Operación realizada con éxito",
            };
        } else {
            result = {
                error: true,
                message: "Error al realizar su operación",
            };
        }

        return result;
    } catch (error) {
        console.error(error);
        return { message: 'Error al buscar productos.', error: true };
    }
};
