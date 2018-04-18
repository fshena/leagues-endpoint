

module.exports = (sequelize, DataTypes) => {
    const league = sequelize.define('League', {
        name: {
            type: DataTypes.STRING(100),
            allowNull: false,
            unique: true,
            validate: {
                is: ['^[a-zA-Z0-9- ]+$', 'i'],
                len: [3, 100],
                notEmpty: true,
            },
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: true,
            defaultValue: null,
        },
        start_date: {
            type: DataTypes.DATE,
            allowNull: false,
            validate: {
                isDate: true,
                notEmpty: true,
            },
        },
        end_date: {
            type: DataTypes.DATE,
            allowNull: false,
            validate: {
                isDate: true,
                notEmpty: true,
            },
        },
        is_active: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
            validate: {
                isBoolean: true,
                notEmpty: true,
            },
        },
    }, {
        freezeTableName: true,
        tableName: 'league',
        underscored: true,
    });
    return league;
};
