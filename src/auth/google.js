const passport = require('passport');
const securePassword = require('secure-random-password');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const { usuarios, datos } = require('../db');
const bcrypt = require("bcrypt");
const { Op } = require('sequelize');

const GOOGLE_CLIENT_ID = ''
const GOOGLE_CLIENT_SECRET = ''
const GOOGLE_CALLBACK_URL = 'http://localhost:3001/auth/callback'

passport.use(
    new GoogleStrategy(
        {
            clientID: GOOGLE_CLIENT_ID,
            clientSecret: GOOGLE_CLIENT_SECRET,
            callbackURL: GOOGLE_CALLBACK_URL,
            passReqToCallback: true,
        },
        async (request, accessToken, refreshToken, profile, done) => {

            const userExist = await usuarios.findOne({ where: { googleId: { [Op.eq]: profile.id } } })

            if (!userExist) {
                const defaultUser = {
                    nombre: profile.name.givenName,
                    apellido: profile.name.familyName,
                    correo: profile.emails[0].value,
                    dni: 0,
                    direccion: '',
                };

                let userData = await datos.create(defaultUser);

                const password = securePassword.randomPassword({ length: 12, characters: securePassword.lower + securePassword.upper + securePassword.digits });

                // Crear un hash de la contraseña
                const hash = await bcrypt.hash(password, 10);

                if (userData) {
                    await usuarios.create({
                        usuario: profile.displayName,
                        password: hash,
                        googleId: profile.id,
                        id_datos: userData.id,
                        id_statud: "1",
                        type: "usuario"
                    })
                }
            }
            done(null, profile)
        }
    )
);

passport.serializeUser(function (user, cb) {
    process.nextTick(function () {
        return cb(null, user);
    });
});

passport.deserializeUser((user, done) => {
    console.log('user', user);
    done(null, user); // Recupera los datos del usuario de la sesión
});

module.exports = passport;