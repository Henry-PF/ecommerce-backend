const { logger } = require("../components/logger")
const { productsReview, usuarios, producto, personas } = require("../db")


/*Importante:
    todas las veces q se consulta el ID del usuario aca esta mockeado. 
    una vez que la autenticacion este hecha, se va a tomar el id de la sesión.
*/

//obtener las reseñas de todos los usuarios.
exports.getProductReview = async (data) => {
    const result = {
        data: null,
        message: "",
        error: false,
    }

    try {

        const allReviews = await getReview(data.id)

        //retornar la respuesta pertinente
        result.data = allReviews.data
        result.error = allReviews.error
        result.message = allReviews.message
        result.status = allReviews.status

    } catch (error) {
        //en caso de errores
        result.error = true
        result.message = "Se produjo un error al obtener las reseñas."
        logger.error(result.message)

    }
    return result
}

//crear reseña
exports.create = async (data) => {
    //resultado
    const result = {
        data: null,
        message: "",
        error: false,
    }

    //ejecucion
    try {
        //obtener y validar datos para la review
        const { contenido, puntuacion, productId, userId } = data.body


        //obtener el usuario

        const product = await producto.findOne({ where: { id: productId } })
        const user = await usuarios.findOne({ where: { id: userId }, attributes: { exclude: ["password"] } })

        if (!product) {
            //si no hay producto cancelamos la creacion
            result.error = true
            result.message = "El producto no existe"
            result.status = 404
        } else if (!user) {
            //si no hay usuario cancelamos la creacion
            result.error = true
            result.message = "El usuario no existe"
            result.status = 404
        } else {

            //revisar si el usuario ya tiene una review: o crear
            const alrPublished = await productsReview.findOne({ where: { id_producto: productId, id_usuario: userId } })

            if (alrPublished) {
                //si existe se evita la creacion.
                result.message = "Ya publicaste una reseña, pero puedes editarla."
                result.status = 409
            } else {
                //crear la review

                const createResult = await createReview({ contenido, puntuacion }, product, user)
                result.message = createResult.message
                result.error = createResult.error
                result.status = createResult.status
            }


        }


    } catch (error) {

        //manejo de errores
        result.error = true
        result.message = error.message
    }

    //devolver el resultado
    return result
}

//modificar reseña
exports.put = async (data) => {
    //resultado
    const result = {
        data: null,
        message: "",
        error: false,
    }
    try {
        //nuevos datos del review
        const { contenido, puntuacion, reviewId, userId, productId } = data.body
        //obtener el usuario y el id del review

        //esto va a cambiar cuando este la auth

        const currentReview = await productsReview.findOne({ where: { id_usuario: userId, id_producto: productId } })

        if (!currentReview) {
            //si no existe la review se omite la actualizacion y se retorna el mensaje 
            result.error = true
            result.message = "No se encontro la reseña solicitada."
            result.status = 404
        } else {

            //actualizar la review
            const updateResult = await updateReview({ contenido, puntuacion }, currentReview)

            //actualizar respuesta
            result.error = updateResult.error
            result.message = updateResult.message
            result.status = updateResult.status
        }



    } catch (error) {
        result.error = error.message
    }

    return result
}

//eliminar reseña: 
exports.del = async (data) => {
    const result = {
        data: null,
        message: "",
        error: false,
    }
    try {
        const { userId, productId } = data.body

        const currentReview = await productsReview.findOne({ where: { id_usuario: userId, id_producto: productId } })


        if (!currentReview) {
            result.error = true
            result.message = "No se encontro la reseña solicitada."
            result.status = 404
        } else {
            const destroyResult = await deleteReviews(currentReview)

            result.message = destroyResult.message
            result.status = destroyResult.status
            result.error = destroyResult.error

        }



    } catch (error) {
        result.error = true
        result.message = error.message
    }
    return result
}

//function para obtener todas las reseñas
async function getReview(id) {
    //resultados
    const result = {
        data: null,
        message: "",
        error: false,
    }
    try {
        const reviews = await productsReview.findAll({
            where: {
                id_producto: id
            },
            include: [
                {
                    model: usuarios,
                    include: [{
                        model: personas
                    }]
                }
            ]
        })

        if (!reviews) {
            result.error = true
            result.message = "Error al obtener las reseñas"
            result.status = 500
        } else {
            result.data = reviews
            result.message = "Reseñas obtenidas con éxito."
        }
    } catch (error) {
        result.error = true
        result.message = error.message
        result.status = 500
    }
    return result
}

//function para crear review
async function createReview(reviewData, product, user) {

    //verificar si la funcion esta implementada correctamente.

    if (!reviewData) {
        throw new Error("createReview no recibio ningun dato.")
    }

    if (!product) {
        throw new Error("createReview necesita recibir el producto")
    }


    //resultados
    const result = {
        data: null,
        message: "",
        error: false,
    }


    try {

        //crear el review
        const newReview = await productsReview.create(reviewData)

        //verificar si se creó con exito.
        if (!newReview) {
            result.message = "Error al publicar tu reseña."
            result.error = true
            result.status = 500
        }

        //relacionar el usuario con la review
        await product.addProductsReview(newReview)
        await user.addProductsReview(newReview)

        //setear resultados a positivo.
        result.message = "Reseña publicada con éxito."
        result.status = 200

    } catch (error) {
        result.message = error.message
        result.error = true
        result.status = 500
    }
    return result
}

//function para editar una reseña
async function updateReview(reviewData, currentReview) {
    if (!reviewData) {
        throw new Error("updateReview no recibio ningun dato.")
    }

    const result = {
        data: null,
        message: "",
        error: false,
    }

    try {
        //actualizando la review
        const updatedReview = await currentReview.update(reviewData)

        //comprobacion  de que el resultado existe.
        if (!updatedReview) {
            result.error = true
            result.message = "Error al actualizar la reseña."
            result.status = 500
        } else {
            result.message = "Reseña actualizada"
        }
    } catch (error) {

        //manejo de errores
        result.error = true
        result.message = "Error al actualizar la reseña."
        result.status = 500
    }
    return result
}

//funcion para eliminar una review
async function deleteReviews(currentReview) {

    //result
    const result = {
        data: null,
        message: "",
        error: false,
    }

    //ejecucion
    try {
        await currentReview.destroy()

        result.message = "Reseña eliminada con éxito."

    } catch (error) {

        //manejo de errores
        result.message = error.message
        result.error = true
    }

    // return 
    return result

}