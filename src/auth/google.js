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

            try {
                const userExist = await usuarios.findOne({
                    include: [{ model: personas, as: 'persona' }],
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
                    include: [{ model: personas, as: 'persona' }],
                    usuario: profile.displayName,
                    password: hash,
                    googleId: profile.id,
                    id_persona: userData.id,
                    id_statud: "1",
                    type: "usuario"
                });

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
            { model: personas, as: 'persona' }
        ]
    }).then(user => {
        done(null, user)
    })
});

module.exports = passport;