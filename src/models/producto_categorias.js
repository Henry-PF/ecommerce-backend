'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class producto_categorias extends Model {
        static associate(models) {
            producto_categorias.belongsTo(models.producto, {
                foreignKey: 'id_producto'
            });
        }
    }

    producto_categorias.init(
        {
            id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                primaryKey: true,
                autoIncrement: true,
                unique: true,
            },
            id_producto: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: 'producto',
                    key: 'id',
                },
            },
            id_categoria: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: 'categoria',
                    key: 'id',
                },
            },
        },
        {
            sequelize,
            modelName: 'producto_categoria',
            tableName: 'producto_categorias',
        }
    );

    return producto_categorias;
};