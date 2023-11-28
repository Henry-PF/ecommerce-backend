const {
  usuarios,
  carrito,
  detalle_carrito,
  pagos,
  factura,
  factura_detalle,
  personas,
  producto,
} = require("../db");
const axios = require("axios");
const { Op } = require("sequelize");
const { sendEmail } = require("../config/mailer.js");
const process = require("process");

const { PAYPAL_API_CLIENT, PAYPAL_API_SECRET, PAYPAL_API } = process.env;

let access_token = "";
setAccess_token = (valor) => {
  access_token = valor;
};
getAccess_token = () => {
  return access_token;
};

exports.createOrder = async (req, res) => {
  try {
    let body = req.body;
    if (body) {
      let dta_User = await usuarios.findOne({
        where: { id: { [Op.eq]: body.id_user } },
      });
      if (dta_User) {
        let dta_carrito = await carrito.findOne({
          where: { id_usuario: { [Op.eq]: dta_User.id } },
        });
        if (dta_carrito) {
          const order = {
            intent: "CAPTURE",
            purchase_units: [
              {
                amount: {
                  currency_code: "USD",
                  value: dta_carrito.total,
                },
                description: "trendy ecommerce sales application",
              },
            ],
            application_context: {
              payment_method: {
                payer_selected: "PAYPAL",
                payee_preferred: "IMMEDIATE_PAYMENT_REQUIRED",
              },
              brand_name: "trendy.com",
              landing_page: "LOGIN",
              user_action: "PAY_NOW",
              shipping_preference: "NO_SHIPPING",
              return_url: `http://localhost:3002/api/pago/capture-order?carrito=${dta_carrito.id}`,
              cancel_url: "http://localhost:3002/api/pago/cancel-order",
            },
          };

          const params = new URLSearchParams();
          params.append("grant_type", "client_credentials");

          const {
            data: { access_token },
          } = await axios.post(
            "https://api-m.sandbox.paypal.com/v1/oauth2/token",
            params,
            {
              headers: {
                "Content-Type": "application/x-www-form-urlencoded",
              },
              auth: {
                username: PAYPAL_API_CLIENT,
                password: PAYPAL_API_SECRET,
              },
            }
          );
          setAccess_token(access_token);
          const response = await axios.post(
            `${PAYPAL_API}v2/checkout/orders`,
            order,
            {
              headers: {
                Authorization: `Bearer ${access_token}`,
              },
            }
          );

          let dtaPaypal = response.data;

          let dtafactura = await factura.create({
            id_statud: 3,
            id_usuario: dta_User.id,
            total: dta_carrito.total,
          });
          let dtaPago = await pagos.create({
            ref: dtaPaypal.id,
            fecha: new Date().toLocaleString(),
            id_factura: dtafactura.id,
            id_statud: 3,
          });
          if (dtaPago) {
            if (dtafactura) {
              let dataCarrito = await detalle_carrito.findAll({
                where: { id_carrito: { [Op.eq]: dta_carrito.id } },
              });
              if (dataCarrito) {
                dataCarrito.forEach(async (element) => {
                  let newData = {
                    id_usuario: dta_User.id,
                    id_factura: dtafactura.id,
                    id_producto: element.id_producto,
                    cantidad: element.cantidad,
                    subtotal: element.subtotal,
                  };
                  let dataDetalleFactura = await factura_detalle.create(
                    newData
                  );
                  if (!dataDetalleFactura) {
                    res.status(500).json({
                      message: "Error al registrar el detalle de la factura",
                      error: true,
                    });
                  }
                });
              } else {
                res.status(500).json({
                  message: "Carrito sin productos asignados",
                  error: true,
                });
              }
            } else {
              res.status(500).json({
                message: "Error al registrar la factura",
                error: true,
              });
            }
          } else {
            res
              .status(500)
              .json({ message: "Error al registrar el pago", error: true });
          }
          res.json(response.data);
        } else {
          res.status(401).json({ message: "carrito no encontrada" });
        }
      } else {
        res.status(401).json({ message: "usuario no encontrado" });
      }
    } else {
      return res.status(401).json({ message: "Faltan campo" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send("Something goes wrong");
  }
};

exports.captureOrder = async (req, res) => {
  const { token } = req.query;
  console.log(req.query);
  try {
    let dtapagos = await pagos.findOne({
      where: {
        ref: {
          [Op.eq]: token,
        },
      },
    });
    if (dtapagos) {
      const response = await axios.post(
        `${PAYPAL_API}v2/checkout/orders/${token}/capture`,
        {},
        {
          headers: {
            Authorization: `Bearer ${getAccess_token()}`,
          },
        }
      );
      if (response.data.status === "COMPLETED") {
        let dtafactura = await factura.findOne({
          include: [
            {
              attributes: { exclude: ["createdAt", "updatedAt"] },
              model: usuarios,
              include: [
                {
                  attributes: { exclude: ["createdAt", "updatedAt"] },
                  model: personas,
                },
                {
                  attributes: { exclude: ["createdAt", "updatedAt"] },
                  model: carrito,
                },
              ],
            },
          ],
          where: {
            id: {
              [Op.eq]: dtapagos.id_factura,
            },
          },
        });
        dtapagos.id_statud = 4;
        await dtapagos.save();

        dtafactura.id_statud = 4;
        await dtapagos.save();
        //Enviaremos la notificacion del pago
        await sendEmail(
          dtafactura.usuario.persona.correo, // Cambia por la dirección de correo a la que deseas enviar la notificación
          "Notificación de Pago",
          "<h1>Su pago se a realizado con éxito</h1>",
          "<h1>Su pago se a realizado con éxito</h1>",
          "<h1>Su pago se a realizado con éxito</h1>"
        );

        const cart = await detalle_carrito.findAll({
          where: {
            id_carrito: {
              [Op.eq]: dtafactura.usuario.carritos[0].id,
            },
          },
        });

        cart?.forEach(async (c) => {
          if (c && c.id_producto) {
            const currentProduct = await producto.findOne({
              where: { id: c.id_producto },
            });
            if (!currentProduct) {
              return;
            }
            await currentProduct.update({ stock: currentProduct?.stock - c.cantidad });
          }
        });

        await detalle_carrito.destroy({
          where: {
            id_carrito: {
              [Op.eq]: dtafactura.usuario.carritos[0].id,
            },
          },
        });

        await carrito.update(
          {
            total: "0",
            fecha: new Date().toLocaleString().toString(),
          },
          {
            where: {
              id: {
                [Op.eq]: dtafactura.usuario.carritos[0].id,
              },
            },
          }
        );
      }
      res.redirect("http://localhost:3001");
    } else {
      res.status(401).json({ message: "ruta no encontrada" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Something goes wrong");
  }
};

exports.cancelOrder = (req, res) => {
  res.redirect("http://localhost:3001");
};
