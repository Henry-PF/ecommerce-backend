const server = require("./src/app.js");
const { conn, usuarios } = require("./src/db.js");

// Syncing all the models at once.
conn.sync({ force: false }).then(() => {
    server.listen(process.env.PORT || 3002, () => {
        console.log("%s listening at 3002"); // eslint-disable-line no-console
    });
});



