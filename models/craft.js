module.exports = function(sequelize, DataTypes) {
    var Craft = sequelize.define("Craft", {
        user_name: {
            type: DataTypes.STRING(100),
            allowNull: false,
            validate: {
                len: [1,100]
            }
        },
        first_name: DataTypes.STRING,
        craft: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                len: [1,100]
            }
        },
        year_experience: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                isNumeric: true,
                len: [0,100]
            }
        },
        experience_rating: {
            type: DataTypes.INTEGER,
            allowNull:false,
            validate: {
                isNumeric:true,
                len: [1,3]
            }
        },
        city: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                len: [1,300]
            }
        },
        goal_set: {
          type:DataTypes.BOOLEAN,
          allowNull:false,
          defaultValue: false
        },
        goal_hours_set: {
          type: DataTypes.INTEGER,
          defaultValue:0,
          allowNull:true,
          validate: {
            isNumeric:true
          }
        },
        goal_hours_accomplished: {
          type: DataTypes.INTEGER,
          defaultValue:0,
          allowNull:true,
          validate: {
            isNumeric:true
          }
        },
        goal_date: {
          type: DataTypes.STRING,
          allowNull:true
        },
        total_goals: {
          type: DataTypes.INTEGER,
          allowNull:true,
          defaultValue:0
        },
        goals_accomplished: {
          type:DataTypes.INTEGER,
          allowNull:true,
          defaultValue:0
        }
    },
    {
        classMethods: {
            associate: function(models) {
                Craft.belongsTo(models.User, {
                    foreignKey: {
                        allowNull: false
                    }
                });
            }
        }
    });
    return Craft;
}
