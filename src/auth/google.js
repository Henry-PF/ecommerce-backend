const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const { usuarios, personas } = require('../db');
const securePassword = require('secure-random-password');
const bcrypt = require("bcrypt");
const { Op } = require('sequelize');

const GOOGLE_CLIENT_ID = '192877010412-ktn34o3f409lh0ltmc0vo7pe08fd381h.apps.googleusercontent.com '
const GOOGLE_CLIENT_SECRET = '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'
const GOOGLE_CALLBACK_URL = 'http://localhost:3002/api/auth/callback'

passport.use(
    new GoogleStrategy(
        {
            clientID: GOOGLE_CLIENT_ID,
            clientSecret: GOOGLE_CLIENT_SECRET,
            callbackURL: GOOGLE_CALLBACK_URL,
            passReqToCallback: true,
        },
        async (request, accessToken, refreshToken, profile, done) => {

            // const userExist = await usuarios.findOne({
            //     include: [{ model: personas }],
            //     where: {
            //         googleId: {
            //             [Op.eq]: profile.id
            //         }
            //     }
            // });

            // if (!userExist) {
            //     const defaultUser = {
            //         nombre: profile.name.givenName,
            //         apellido: profile.name.familyName,
            //         correo: profile.emails[0].value,
            //         dni: 0,
            //         direccion: '',
            //     };

            //     let userData = await datos.create(defaultUser);

            //     const password = securePassword.randomPassword({ length: 12, characters: securePassword.lower + securePassword.upper + securePassword.digits });

            //     // Crear un hash de la contraseña
            //     const hash = await bcrypt.hash(password, 10);

            //     if (userData) {
            //         const newGoogleUser = await usuarios.create({
            //             include: [{ model: personas }],
            //             nick: profile.displayName,
            //             password: hash,
            //             googleId: profile.id,
            //             id_datos: userData.id,
            //             id_statud: "1",
            //             type: "usuario"
            //         })
            //         done(null, newGoogleUser)
            //     }
            // }
            // done(null, userExist)
            done(null, profile)
        }
    )
);

passport.serializeUser(function (user, done) {
    done(null, user.id)
});

passport.deserializeUser((id, done) => {
    // usuarios.findByPk(id, {
    //     include: [
    //         { model: personas, as: 'persona' }
    //     ]
    // }).then(user => {
    //     console.log(user);
    //     done(null, user)
    // })
    done(null, id)
});

module.exports = passport;