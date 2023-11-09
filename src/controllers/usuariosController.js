const {usuarios,personas, statud} = require("../db");
const { Op } = require("sequelize");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const sendEmail = require('../config/mailer');
const process = require("process");
const env = process.env


exports.create = async (data) => {
    let result = {};
    let dataUser = data.body;

    try {
        if (dataUser.data) {
            let dta = dataUser.data;
            let dtaPersona = {
                nombre: dta.nombre,
                apellido: dta.apellido,
                correo: dta.correo,
                dni: dta.dni,
                direccion: dta.direccion,
                telefono: dta.telefono,
                googleId: dta.googleId
            }
            let hashF = await bcrypt.hash(dataUser.password, 10).then(hash => {
                return hash;
            })
            let dtaUsuario = {
                usuario: dataUser.usuario,
                password: hashF,
                id_statud: "1",
                type: "usuario",
            }
            //Verficacion si los datos de la persona ya existe
            const personaExiste = await datos.findOne({ where: { correo: { [Op.eq]: dtaPersona.correo } } })
            if (!personaExiste) {
                data_p = await datos.create(dtaPersona).then(data => {
                    dtaUsuario.id_persona = data.id
                });
            } else {
                dtaUsuario.id_persona = personaExiste.id
            }
            //Crear usuario
            user = await usuarios.create(dtaUsuario);

            if (user) {
                result.data = user;
                result.message = "Usuario registrado con éxito";
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
                        <li>Nombre de usuario: ${dataUser.usuario}</li>
                    </ul>
                    <p>¡Si tienes alguna pregunta o necesitas asistencia, no dudes en ponerte en contacto con nuestro equipo de soporte!</p>
                    <p>¡Esperamos que disfrutes de tu experiencia con Trendy!</p>`
                );
                result.data = user;
                result.message = "Usuario registrado con éxito";
                await sendEmail(
                    dtaPersona.correo,
                    "Bienvenido a Trendy ✔",
                    "<h1>Bienvenido a Trendy</h1>",
                    `<p>Hola ${dtaPersona.nombre},</p>
                        <p>Gracias por registrarte en Trendy, tu tienda online. Estamos emocionados de tenerte como parte de nuestra comunidad.</p>
                    <p>
                    A continuación, encontrarás algunos detalles sobre tu cuenta:
                    </p>
                    <ul>
                        <li>Nombre de usuario: </li>
                    </ul>
                    <p>¡Si tienes alguna pregunta o necesitas asistencia, no dudes en ponerte en contacto con nuestro equipo de soporte!</p>
                    <p>¡Esperamos que disfrutes de tu experiencia con Trendy!</p>`
                );
                console.log(sendEmail);
            } else {
                throw new Error("Error al intentar registrar el usuario");
            }

        } else {
            throw new Error("Error faltan datos para proceder con el registro");
        }
    } catch (error) {
        result.error = error.message;
    }
    console.log(result);
    return result;
}


exports.update = async (data) => {
    let result = {};
    try {

    } catch (error) {
        result.error = error.message;
    }
    return result;
}
exports.findAll = async () => {
    let result = {};
    try {
        await usuarios.findAll({
            attributes: { exclude: ['password', 'id_persona', 'id_statud'] },
            include: [{ model: datos }, { model: statud }]
        }).then((dta) => {
            result.data = dta;
        });

    } catch (error) {
        console.log(error)
        result.error = error.message;
    }
    return result;
}
exports.FindID = async (id) => {
    let result = {};
    try {
        await usuarios.findOne({
            attributes: { exclude: ['password', 'id_persona', 'id_statud'] },
            include: [{ model: datos }, { model: statud }],
            where: {
                id: {
                    [Op.eq]: id
                }
            }
        }).then((dta) => {
            result.data = dta;
        });

    } catch (error) {
        console.log(error)
        result.error = error.message;
    }
    return result;
}

exports.login = async (data) => {
    let result = {};
    try {
        await datos.findOne({
            include: [
                {
                    model: usuarios,
                    include: { model: statud },
                    where: {
                        id_statud: {
                            [Op.eq]: 1
                        }
                    }
                }
            ],
            where: {
                correo: {
                    [Op.eq]: data.correo
                }
            }
        }).then((dta) => {
            if (dta) {
                if (!bcrypt.compareSync(data.password, dta.usuarios[0].password)) {
                    throw new Error('Contraseña incorrecta');
                } else {
                    const token = jwt.sign({ userId: dta.usuarios[0].usuario.id }, env.SECRECT_TOKEN, {
                        expiresIn: "1h",
                    });
                    result.data = dta;
                    result.token = token;
                }
            } else {
                result.error = "Usuario no registrado";
            }
        });
    } catch (error) {
        console.log(error)
        result.error = error.message;
    }
    return result;
}

exports.Delete = async (id) => {
    let result = {};
    try {
        let dataUser = await usuarios.findOne({
            where: {
                id: {
                    [Op.eq]: id
                }
            }
        });
        if (dataUser) {
            let dtaN = await usuarios.update({ isactivo: false }, {
                where: {
                    id: {
                        [Op.eq]: id
                    }
                }
            });
            if (dtaN) {
                result.data = {
                    message: "usuario eliminado con exito"
                };
            }
        }
    } catch (error) {
        console.log(error)
        result.error = error.message;
    }
    return result;
}

exports.findEmail = async (data) => {
    let result = {};
    try {
        if (data.email) {
            let dataUser = await datos.findOne({
                where: {
                    correo: {
                        [Op.eq]: data.email
                    }
                },
                includes: [{ model: usuarios }]
            })
            if (dataUser) {
                result.data = dataUser;
            } else {
                result.error = {
                    message: "usuario no encontrado"
                };
            }
        } else {
            result.error = {
                message: "falta el campo email"
            };
        }
    } catch (error) {
        console.log(error)
        result.error = error.message;
    }
    return result;
}

const generarString = (longitud) => {
    let result = "";
    const abc = "a b c d e f g h i j k l m n o p q r s t u v w x y z".split(" "); // Espacios para convertir cara letra a un elemento de un array
    for (i = 0; i <= longitud; i++) {
        const random = Math.floor(Math.random() * abc.length);
        result += abc[random]
    }
    return result;
};
exports.forgoPassword = async (data) => {
    let result = {};
    try {
        await datos.findOne({
            include: [
                {
                    model: usuarios,
                    attributes:['id','password'],
                    where: {
                        id_statud:{
                            [Op.eq] : 1
                        }
                    }
                }
            ],
            where: {
                correo: {
                    [Op.eq]: data.correo
                }
            }
        }).then(async (dta) => {
            if (dta) {
                let newPass = generarString(8);
                let hashF = await bcrypt.hash(newPass, 10).then(hash => {
                    return hash;
                })
                let updateDta = await usuarios.update({ password: hashF }, {
                    where: {
                        id:{
                            [Op.eq]: dta.usuarios[0].dataValues.id
                        }
                    }
                });
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

    } catch (error) {
        console.log(error)
        result.error = error.message;
    }
    return result;
}