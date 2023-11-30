const { config } = require("dotenv");
const { sendEmail } = require("../config/mailer");
const { mailsuscriptors } = require("../db");
const { logger } = require("../components/logger");
config();
exports.suscribeEmail = async (data) => {
  let result = {};

  try {
    const [row, isNEw] = await mailsuscriptors.findOrCreate({
      where: { email: data.email },
      defaults: { email: data.email },
    });

    if (row) {
      if (!isNEw) {
        result.message = "Ya estas suscrito, muchas gracias.";
        result.status = 409;
        return result;
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

exports.sendNewsController = async (title, content) => {
  const result = {};
  try {
    const subs = await mailsuscriptors.findAll();
    const emails = subs?.map((s) => ({
      email: s.email,
      id: s.id,
    }));

    const message = `${content} \n 

`;

    emails.forEach((email) => {
      sendEmail(email.email, title, message, message, true, email?.id);
    });

    return (result.data = emails);
  } catch (error) {
    result.message = error.message;
    result.error = true;
    logger.error(error.message);
  }
  return result;
};

exports.unsubscribeController = async (id) => {
  const result = {};
  try {
    const done = await mailsuscriptors.destroy({ where: { id } });

    if (!done) {
      result.message = "No estabas suscrito, operacion cancelada.";
      result.status = 404;
    } else {
      result.message = "Listo, ya no te llegaran notificaciones";
    }
  } catch (error) {
    result.message = error.message;
    result.error = true;
    result.status = 500;
    logger.error(error.message);
  }

  return result;
};
