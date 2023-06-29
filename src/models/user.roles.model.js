const { DataTypes } = require("sequelize");

const sequelize = require("../db");

const Roles = sequelize.define("user_roles", {
  _id: {
    type: DataTypes.UUID,
    primaryKey: true,
    allowNull: false,
    defaultValue: DataTypes.UUIDV4,
  },
  role: {
    type: DataTypes.STRING,
  },
});


Roles.sync().then(()=>{
    console.log("roles model synced")
}).catch((error)=>{
    console.log(error)
})


module.exports = Roles