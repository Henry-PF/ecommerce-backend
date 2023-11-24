const { logger } = require("../components/logger")
const { favoritos_productos, producto, usuarios, img_productos } = require("../db")

//obtener 
exports.getFavoritos = async (id) => {
    const result = {
        data: [],
        message: "",
        error: false,
    }
    try {

        const userId = id

        if (!userId) {
            result.message = "Faltan datos para la consulta"
            result.status = 400
            return result
        }

        const favoritos = await getFavs(userId)

        result.data = favoritos.data
        result.message = favoritos.message
        result.error = favoritos.error
        result.status = favoritos.status

    } catch (error) {
        //manejo de errores
        result.error = true
        result.message = "Se produjo un error al obtener favoritos."
        logger.error(error.message)
    }
    return result
}

exports.addFavorito = async (data) => {
    const result = {
        data: [],
        message: "",
        error: false,
    }
    try {
        const { userId, productId } = data

        if (!userId || !productId) {
            result.data = []
            result.error = true
            result.message = "Debes iniciar sesión"
            result.status = 201
            return result
        }

        const addResult = await addFavs(userId, productId)

        result.message = addResult.message
        result.data = addResult.data
        result.status = addResult.status
        result.error = addResult.error

    } catch (error) {
        //manejo de errores
        console.error(error)
        result.error = true
        result.message = "Se produjo un error al agregar a favoritos."
        logger.error(error.message)
    }
    return result
}

exports.deleteFavs = async (data) => {
    console.log('deleteFav', data);
    const result = {
        data: [],
        message: "",
        error: false,
    }
    try {

        const productId = data?.productId
        const userId = data?.userId
        if (!productId || !userId) {
            result.message = "Faltan datos para la consulta"
            result.status = 400
            return result
        }

        const deleteResult = await delFavs(userId, productId)

        result.data = deleteResult.data
        result.message = deleteResult.message
        result.error = deleteResult.error
        result.status = deleteResult.status

    } catch (error) {
        //manejo de errores
        console.error(error)
        result.error = true
        result.message = "Se produjo un error al agregar a favoritos."
        logger.error(error.message)
    }
    return result
}

//funciones

//obtener favoritos
async function getFavs(id) {
    //respuesta
    const result = {
        data: null,
        message: "",
        error: false,
    }
    try {
        const favs = await favoritos_productos.findAll({
            where: {
                id_usuario: id
            },
            attributes: { exclude: ['createdAt', 'updatedAt'] },
            include: [
                {
                    model: producto,
                    attributes: { exclude: ['createdAt', 'updatedAt'] },
                    include: {
                        model: img_productos
                    },
                },
            ]
        })

        result.message = "Tus favoritos"
        result.data = favs


    } catch (error) {
        //manejo de errores.
        result.error = true
        result.message = "Error al obtener favoritos."
        result.status = 500
        logger.error(error.message)
    }
    return result
}

//agregar favoritos

async function addFavs(userId, productId) {
    //respuesta
    const result = {
        data: null,
        message: "",
        error: false,
    }
    try {
        const user = await usuarios.findOne({ where: { id: userId } })

        if (!user) {
            result.message = "No se encontro el usuario solicitado."
            result.status = 404
            return result
        }


        const product = await producto.findOne({ where: { id: productId } })

        if (!product) {
            result.message = "No se encontro el producto solicitado."
            result.status = 404
            return result
        }

        const [row, isNew] = await favoritos_productos.findOrCreate({
            where: {
                id_usuario: userId,
                id_producto: productId
            },
            defaults: {}
        })

        if (!isNew) {
            result.error = true
            result.message = "El producto ya está en tu lista de favoritos."
            result.status = 200
            return result
        }


        const operation = await user.addFavoritos_producto(row)

        if (operation) {
            result.message = "Producto añadido con éxito"
            result.data = await favoritos_productos.findOne({
                where: {
                    id_usuario: userId,
                    id_producto: productId
                }
            })
        } else {
            logger.error("Se produjo un error al añadir un producto a favoritos.")
            result.message = "Se produjo un error al añadir el producto a favoritos"
            result.status = 500
            result.error = true
        }


    } catch (error) {
        //manejo de errores.
        result.error = true
        result.message = "Error al obtener favoritos."
        result.status = 500
        logger.error(error.message)
    }
    return result
}


//delete
async function delFavs(userId, productId) {
    //respuesta
    const result = {
        data: [],
        message: "",
        error: false,
    }
    try {
        const user = await usuarios.findOne({ where: { id: userId } })

        if (!user) {
            result.message = "No se encontró el usuario solicitado."
            result.status = 404
            return result
        }
        const fav = await favoritos_productos.findOne({ where: { id_usuario: userId, id_producto: productId } })

        if (!fav) {
            result.message = "El producto solicitado no está en tu lista de favoritos."
            result.status = 404
            return result
        } else {

            await user.removeFavoritos_producto(fav)
            result.message = "Producto eliminado con éxito"
        }

    } catch (error) {
        //manejo de errores.
        result.error = true
        result.message = "Error al obtener favoritos."
        result.status = 500
        logger.error(error.message)
    }
    return result
}
