const { DataTypes } = require("sequelize");

const sequelize = require("../db");

const Roles = sequelize.define("user_roles", {
  _id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    allowNull: false,
    autoIncrement:true
  },
  role: {
    type: DataTypes.STRING,
  },
});

Roles.sync({alter:true}).then(()=>{
    console.log("roles model synced")
}).catch((error)=>{
    console.log(error)
})


module.exports = Roles