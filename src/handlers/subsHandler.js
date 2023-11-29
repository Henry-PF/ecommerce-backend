const { logger } = require("../components/logger");
const {
  suscribeEmail,
  sendNewsController,
  unsubscribeController,
} = require("../controllers/subsController");

exports.subemail = async (req, res) => {
  let result = {};
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  try {
    if (req.body) {
      if (!emailRegex.test(req?.body?.email)) {
        result.message = "Ingresá un email válido";
        result.status = 400;
      } else {
        result = await suscribeEmail(req.body);
      }
    } else {
      result = { message: "faltan campos", error: true };
    }
    res.status(result.status || 200).json(result);
  } catch (error) {
    logger.error(error.message);
    res.status(500).json({ message: error.message, error: true });
  }
};

exports.sendNews = async (req, res) => {
  let result = {};

  try {
    if (!req.body.title || !req.body.content) {
      result.message = "Faltan campos";
      return res.status(400).json(result);
    }

    result = await sendNewsController(req.body.title, req.body.content);

    res.status(result.status || 200).json(result);
  } catch (error) {
    logger.error(error.message);
    res.status(500).json({ message: error.message, error: true });
  }
};

exports.unsubscribe = async (req, res) => {
  let result = {};

  try {
    if (!req.body.id) {
      result.message = "Faltan campos";
      return res.status(400).json(result);
    }

    result = await unsubscribeController(req?.body?.id);

    res.status(result.status || 200).json(result);
  } catch (error) {
    logger.error(error.message);
    res.status(500).json({ message: error.message, error: true });
  }
};
