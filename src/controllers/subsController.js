const { mailsuscriptors } = require("../db");

exports.suscribeEmail = async (data) => {
  let result = {};

  try {
    const [row, isNEw] = await mailsuscriptors.findOrCreate({
      where: { email: data.email },
      defaults: { email: data.email },
    });

    if (row) {
        if (!isNEw) {
            result.message = "Ya estas suscrito, muchas gracias."
            result.status = 409
            return result
        }
      result.message = "¡Muchas gracias!";
      result.error = false;
    } else {
      const error = new Error(
        "Se produjo un error al añadir un email al tablon de noticias"
      );
      result.message = error.message;
      result.error = true;
      result.status = 500;
      logger(error.message);
      throw error;
    }
  } catch (error) {
    result.message = error.message;
    result.error = true;
    logger.error(error.message);
  }
  return result;
};
