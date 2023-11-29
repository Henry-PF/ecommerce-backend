const { suscribeEmail } = require("../controllers/subsController");

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
