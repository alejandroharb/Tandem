module.exports = function(sequelize, DataTypes) {
  var Activity = sequelize.define("Activity", {
    first_name: DataTypes.STRING,
    user_name: DataTypes.STRING,
    image: DataTypes.STRING,
    craft: DataTypes.STRING,
    city: DataTypes.STRING,
    hours_accomplished: DataTypes.INTEGER,
    date: DataTypes.DATE
  });
  return Activity;
}
