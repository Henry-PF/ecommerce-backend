const { usuarios, personas, statud, carrito } = require("../db");
const { Op } = require("sequelize");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { sendEmail } = require("../config/mailer");
const process = require("process");
const env = process.env;
const { logger } = require("../components/logger");

exports.create = async (data) => {
    let result = {};
    try {
        if (data) {
            let dta = data.data;
            let dtaPersona = {
                nombre: dta.nombre,
                apellido: dta.apellido,
                correo: dta.correo,
                dni: dta.dni,
                direccion: dta.direccion,
                telefono: dta.telefono,
            };
            let hashF = await bcrypt.hash(data.password, 10).then((hash) => {
                return hash;
            });
            let dtaUsuario = {
                usuario: data.usuario,
                password: hashF,
                id_statud: 1,
                type: "usuario",
                googleId: "",
            };
            //Verficacion si los datos de la persona ya existe
            const personaExiste = await personas.findOne({
                where: { correo: { [Op.eq]: dtaPersona.correo } },
            });
            if (!personaExiste) {
                data_p = await personas.create(dtaPersona).then((data) => {
                    dtaUsuario.id_persona = data.id;
                });
            } else {
                dtaUsuario.id_persona = personaExiste.id;
            }
            //Crear usuario
            user = await usuarios.create(dtaUsuario);

            if (user) {
                try {
                    const dataCart = {
                        id_usuario: user.id,
                        id_statud: 1,
                        total: 0,
                        fecha: new Date().toLocaleDateString().toString(),
                    };

                    await carrito.create(dataCart);
                } catch (error) {
                    console.error(error);
                }
            }

            if (user) {
                await sendEmail(
                    dta.correo,
                    "Bienvenido a Trendy ✔",
                    "<h1>Bienvenido a Trendy</h1>",
                    `<p>Hola ${dtaPersona.nombre},</p>
                        <p>Gracias por registrarte en Trendy, tu tienda online.</p>
                    <p>
                    A continuación, encontrarás algunos detalles sobre tu cuenta:
                    </p>
                    <ul>
                        <li>Nombre de usuario: ${dtaUsuario.usuario}</li>
                    </ul>
                    <p>¡Si tienes alguna pregunta o necesitas asistencia, no dudes en ponerte en contacto con nuestro equipo de soporte!</p>
                    <p>¡Esperamos que disfrutes de tu experiencia con Trendy!</p>`
                );
                result.data = user;
                result.message = "Usuario registrado con éxito";
            } else {
                throw new Error("Error al intentar registrar el usuario");
            }
        } else {
            throw new Error("Error faltan datos para proceder con el registro");
        }
        return result;
    } catch (error) {
        logger.error(error.message);
        return (result = { message: error.message, error: true });
    }
};

exports.update = async (data) => {
    let result = {};
    try {
        if (data) {
            let dataUser = await usuarios.findOne({
                include: [personas],
                where: {
                    id: {
                        [Op.eq]: data.id,
                    },
                },
            });
            if (dataUser) {
                let data_persona = {
                    nombre: data.nombre,
                    apellido: data.apellido,
                    telefono: data.telefono,
                    direccion: data.direccion,
                    dni: data.dni,
                };
                await personas.update(data_persona, {
                    where: {
                        id: {
                            [Op.eq]: dataUser.id_persona,
                        },
                    },
                });
                let data_usuario = {
                    type: data.type,
                    id_statud: data.id_statud,
                };
                await usuarios.update(data_usuario, {
                    where: {
                        id: {
                            [Op.eq]: data.id,
                        },
                    },
                });
            }
        }
        return result;
    } catch (error) {
        logger.error(error.message);
        return (result = { message: error.message, error: true });
    }
};
exports.findAll = async () => {
    let result = {};
    try {
        await usuarios
            .findAll({
                attributes: {
                    exclude: ["password", "id_persona", "id_statud"],
                },
                include: [{ model: personas }, { model: statud }],
            })
            .then((dta) => {
                result.data = dta;
            });

        return result;
    } catch (error) {
        logger.error(error.message);
        return (result = { message: error.message, error: true });
    }
};

exports.FindID = async (id) => {
    let result = {};
    try {
        await usuarios
            .findOne({
                attributes: {
                    exclude: ["password", "id_persona", "id_statud"],
                },
                include: [
                    { model: personas },
                    { model: statud },
                    { model: carrito },
                ],
                where: {
                    id: {
                        [Op.eq]: id,
                    },
                },
            })
            .then((dta) => {
                result.data = dta;
            });

        return result;
    } catch (error) {
        logger.error(error.message);
        return (result = { message: error.message, error: true });
    }
};

exports.Delete = async (id) => {
    let result = {};

    try {
        let dataUser = await usuarios.findOne({
            where: {
                id: {
                    [Op.eq]: id.id,
                },
            },
        });
        console.log(id);
        if (dataUser) {
            let dtaN = await usuarios.update(
                { id_statud: id.id_status },
                {
                    where: {
                        id: {
                            [Op.eq]: id.id,
                        },
                    },
                }
            );
            console.log("user updated, ", dtaN);
            if (dtaN) {
                result.data = {
                    message: "usuario eliminado con exito",
                };
            }
        }
        return result;
    } catch (error) {
        logger.error(error.message);
        return (result = { message: error.message, error: true });
    }
};

exports.findEmail = async (data) => {
    let result = {};
    try {
        if (data.email) {
            let dataUser = await personas.findOne({
                where: {
                    correo: {
                        [Op.eq]: data.email,
                    },
                },
                includes: [{ model: usuarios }],
            });
            if (dataUser) {
                result.data = dataUser;
            } else {
                result.error = {
                    message: "usuario no encontrado",
                };
            }
        } else {
            result.error = {
                message: "falta el campo email",
            };
        }
        return result;
    } catch (error) {
        logger.error(error.message);
        return (result = { message: error.message, error: true });
    }
};

const generarString = (longitud) => {
    let result = "";
    const abc = "a b c d e f g h i j k l m n o p q r s t u v w x y z".split(
        " "
    ); // Espacios para convertir cara letra a un elemento de un array
    for (i = 0; i <= longitud; i++) {
        const random = Math.floor(Math.random() * abc.length);
        result += abc[random];
    }
    return result;
};
exports.forgoPassword = async (data) => {
    let result = {};
    try {
        await personas
            .findOne({
                include: [
                    {
                        model: usuarios,
                        attributes: ["id", "password"],
                        where: {
                            id_statud: {
                                [Op.eq]: 1,
                            },
                        },
                    },
                ],
                where: {
                    correo: {
                        [Op.eq]: data.correo,
                    },
                },
            })
            .then(async (dta) => {
                if (dta) {
                    let newPass = generarString(8);
                    let hashF = await bcrypt.hash(newPass, 10).then((hash) => {
                        return hash;
                    });
                    let updateDta = await usuarios.update(
                        { password: hashF },
                        {
                            where: {
                                id: {
                                    [Op.eq]: dta.usuarios[0].dataValues.id,
                                },
                            },
                        }
                    );
                    if (updateDta) {
                        await sendEmail(
                            dta.correo,
                            "Trendy",
                            "<h1>Recuperacion de contraseña</h1>",
                            `<p>Hola ${dta.nombre} ${dta.apellido},</p>
                            <p>Su nueva contraseña es: ${newPass}.</p>
                        <p>`
                        );
                    }
                    result.message = "Operacion Realizada con exito";
                } else {
                    result.error = "Usuario no registrado";
                }
            });
        return result;
    } catch (error) {
        logger.error(error.message);
        return (result = { message: error.message, error: true });
    }
};
exports.login = async (data) => {
    console.log(data);
    let result = {};
    try {
        await personas
            .findOne({
                include: [
                    {
                        model: usuarios,
                        include: { model: statud, model: carrito },
                        where: {
                            id_statud: {
                                [Op.eq]: 1,
                            },
                        },
                    },
                ],
                where: {
                    correo: {
                        [Op.eq]: data.correo,
                    },
                },
            })
            .then((dta) => {
                if (dta) {
                    if (
                        !bcrypt.compareSync(
                            data.password,
                            dta.usuarios[0].password
                        )
                    ) {
                        throw new Error("Contraseña incorrecta");
                    } else {
                        const token = jwt.sign(
                            { userId: dta.usuarios[0].usuario.id },
                            env.SECRECT_TOKEN,
                            {
                                expiresIn: "1h",
                            }
                        );
                        result.data = dta.usuarios[0];
                        result.token = token;
                    }
                } else {
                    throw new Error("Usuario no registrado");
                    // result.error = "Usuario no registrado";
                }
            });
        console.log(result);
        return result;
    } catch (error) {
        logger.error(error.message);
        return (result = { message: error.message, error: true });
    }
};
