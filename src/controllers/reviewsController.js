const { review, usuarios } = require("../db")


/*Importante:
    todas las veces q se consulta el ID del usuario aca esta mockeado. 
    una vez que la autenticacion este hecha, se va a tomar el id de la sesión.
*/

//obtener las reseñas de todos los usuarios.
exports.getAllReviews = async () => {
    const result = {
        data: null,
        message: "",
        error: false,
    }
    try {
        const allReviews = await getAllReviews()

        //retornar la respuesta pertinente
        result.data = allReviews.data
        result.error = allReviews.error
        result.message = allReviews.message
        result.status = allReviews.status

    } catch (error) {
        //en caso de errores
        result.error = true
        result.message = "Se produjo un error al obtener las reseñas."
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
        const { contenido, puntuacion } = data.body


        //obtener el usuario
        const userId = 1
        const user = await usuarios.findOne({ where: { id: userId }, attributes: { exclude: ["password"] } })

        if (!user) {
            //si no hay usuario cancelamos la creacion
            result.error = true
            result.message = "El usuario no existe"
            result.status = 404
        } else {

            //crear la review

            const createResult = await createReview({ contenido, puntuacion }, user)
            result.message = createResult.message
            result.error = createResult.error
            result.status = createResult.status
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
        const { contenido, puntuacion } = data.body
        //obtener el usuario y el id del review

        //esto va a cambiar cuando este la auth
        const userId = 1
        const currentReviewId = data.body.id

        const currentReview = await review.findOne({ where: { id_usuario: userId, id: currentReviewId } })

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


//function para obtener todas las reseñas
async function getAllReviews() {
    //resultados
    const result = {
        data: null,
        message: "",
        error: false,
    }
    try {
        const reviews = await review.findAll({
            includes: {
                model: usuarios,
                attributes: {
                    exclude: ["password"]
                }
            }
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
async function createReview(reviewData, user) {

    //verificar si la funcion esta implementada correctamente.

    if (!reviewData) {
        throw new Error("createReview no recibio ningun dato.")
    }

    if (!user) {
        throw new Error("createReview necesita recibir el usuario")
    }


    //resultados
    const result = {
        data: null,
        message: "",
        error: false,
    }


    try {

        //crear el review
        const newReview = await review.create(reviewData)

        //verificar si se creó con exito.
        if (!newReview) {
            result.message = "Error al publicar tu reseña."
            result.error = true
            result.status = 500
        }

        //relacionar el usuario con la review
        await user.addReview(newReview)

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