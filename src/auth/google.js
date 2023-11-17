const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const { usuarios, personas, carrito } = require('../db');
const securePassword = require('secure-random-password');
const bcrypt = require("bcrypt");
const { Op } = require('sequelize');
const process = require("process");
const { sendEmail } = require('../config/mailer');
const env = process.env;

const GOOGLE_CALLBACK_URL = 'http://localhost:3002/api/auth/callback';

passport.use(
    new GoogleStrategy(
        {
            clientID: env.MAILER_CLIENTEID,
            clientSecret: env.MAILER_CLIENTSECRET,
            callbackURL: GOOGLE_CALLBACK_URL,
            passReqToCallback: true,
        },
        async (request, accessToken, refreshToken, profile, done) => {
            try {
                const userExist = await usuarios.findOne({
                    include: [{ model: personas }],
                    where: {
                        googleId: {
                            [Op.eq]: profile.id
                        }
                    }
                });

                if (userExist) {
                    return done(null, userExist);
                }

                const defaultUser = {
                    nombre: profile.name.givenName,
                    apellido: profile.name.familyName,
                    correo: profile.emails[0].value,
                    dni: 0,
                    telefono: 0,
                    direccion: '',
                };

                const userData = await personas.create(defaultUser);
                const password = securePassword.randomPassword({ length: 12, characters: securePassword.lower + securePassword.upper + securePassword.digits });
                const hash = await bcrypt.hash(password, 10);

                const newGoogleUser = await usuarios.create({
                    usuario: profile.displayName,
                    password: hash,
                    googleId: profile.id,
                    id_persona: userData.id,
                    id_statud: "1",
                    type: "usuario",

                }, {
                    include: [
                        { model: personas }
                    ]
                });

                if (newGoogleUser) {
                    console.log(newGoogleUser);
                    try {
                        const dataCart = {
                            id_usuario: newGoogleUser.id,
                            id_statud: 1,
                            total: 0,
                            fecha: new Date().toLocaleDateString().toString()
                        }

                        await carrito.create(dataCart)
                    } catch (error) {
                        console.error(error);
                    }
                }

                if (newGoogleUser) {
                    await sendEmail(
                        defaultUser.correo,
                        "Bienvenido a Trendy ✔",
                        "<h1>Bienvenido a Trendy</h1>",
                        `<p>Hola ${defaultUser.nombre},</p>
                            <p>Gracias por registrarte en Trendy, tu tienda online.</p>
                        <p>
                        A continuación, encontrarás algunos detalles sobre tu cuenta:
                        </p>
                        <ul>
                            <li>Nombre de usuario: ${newGoogleUser.usuario}</li>
                        </ul>
                        <p>¡Si tienes alguna pregunta o necesitas asistencia, no dudes en ponerte en contacto con nuestro equipo de soporte!</p>
                        <p>¡Esperamos que disfrutes de tu experiencia con Trendy!</p>`
                    );
                    console.log(newGoogleUser);
                }
                return done(null, newGoogleUser);
            } catch (error) {
                console.error(error);
                return done(error);
            }
        }
    )
);

passport.serializeUser(function (user, done) {
    done(null, user.id)
});

passport.deserializeUser((id, done) => {
    usuarios.findByPk(id, {
        include: [
            { model: personas }
        ]
    }).then(user => {
        done(null, user)
    })
});

module.exports = passport;