const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const { usuarios, personas } = require('../db');
const securePassword = require('secure-random-password');
const bcrypt = require("bcrypt");
const { Op } = require('sequelize');

const GOOGLE_CALLBACK_URL = 'http://localhost:3002/api/auth/callback';
const process = require("process");
const env = process.env;

passport.use(
    new GoogleStrategy(
        {
            clientID: env.MAILER_CLIENTEID,
            clientSecret: env.MAILER_CLIENTSECRET,
            callbackURL: GOOGLE_CALLBACK_URL,
            passReqToCallback: true,
        },
        async (request, accessToken, refreshToken, profile, done) => {

            const userExist = await usuarios.findOne({
                include: [{ model: personas }],
                where: {
                    googleId: {
                        [Op.eq]: profile.id
                    }
                }
            });

            if (!userExist) {
                console.log(profile)
                const defaultUser = {
                    nombre: profile.name.givenName,
                    apellido: profile.name.familyName,
                    correo: profile.emails[0].value,
                    dni: 0,
                    telefono: 0,
                    direccion: '',
                };

                let userData = await personas.create(defaultUser);

                const password = securePassword.randomPassword({ length: 12, characters: securePassword.lower + securePassword.upper + securePassword.digits });

                // Crear un hash de la contraseña
                const hash = await bcrypt.hash(password, 10);

                if (userData) {
                    const newGoogleUser = await usuarios.create({
                        include: [{ model: personas }],
                        usuario: profile.displayName,
                        password: hash,
                        googleId: profile.id,
                        id_datos: userData.id,
                        id_statud: "1",
                        type: "usuario"
                    })
                    done(null, newGoogleUser)
                }
            }
            done(null, userExist)
        }
    )
);

passport.serializeUser(function (user, done) {
    done(null, user.id)
});

passport.deserializeUser((id, done) => {
    usuarios.findByPk(id, {
        include: [
            { model: personas, as: 'persona' }
        ]
    }).then(user => {
        console.log(user);
        done(null, user)
    })
    done(null, id)
});

module.exports = passport;