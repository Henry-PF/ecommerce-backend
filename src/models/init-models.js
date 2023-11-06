const fs = require("fs");
const path = require("path");
const basename = path.basename(__filename);

exports.initModels=(sequelize) =>{
    fs.readdirSync(path.join(__dirname)).filter((file) => {
        return (
          file.indexOf(".") !== 0 &&
          file !== basename &&
          file.slice(-3) === ".js" &&
          file.indexOf(".test.js") === -1
        );
    }).forEach((file) => {
      db.push(require(path.join(__dirname, file)));
    });
    db.forEach((modelName) => modelName(sequelize, Sequelize.DataTypes));
    let entries = Object.entries(sequelize.models);
    let capsEntries = entries.map((entry) => [
      entry[0][0] + entry[0].slice(1),
      entry[1],
    ]);

    sequelize.models = Object.fromEntries(capsEntries);
    
    Object.keys(sequelize.models).forEach((modelDb) => {
      if (sequelize.models[modelDb].associate) {
        sequelize.models[modelDb].associate(sequelize.models);
      }
    });
    return sequelize.models;
}