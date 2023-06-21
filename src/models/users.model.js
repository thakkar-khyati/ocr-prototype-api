const { DataTypes, where } = require("sequelize");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const bcrypt = require("bcrypt");

dotenv.config();
const sequelize = require("../db");

const User = sequelize.define("users", {
  _id: {
    type: DataTypes.UUID,
    primaryKey: true,
    allowNull: false,
    defaultValue: DataTypes.UUIDV4,
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    autoIncrement: true,
  },
  firstname: {
    type: DataTypes.STRING,
    allowNull:false,
    validate:{
      notEmpty:true
    }
  },
  lastname: {
    type: DataTypes.STRING,
    allowNull:false,
    validate:{
      notEmpty:true
    }
  },
  email: {
    type: DataTypes.STRING,
    allowNull:false,
    unique:true,
    validate:{
      notEmpty:true,
      isEmail:true
    }
  },
  password: {
    type: DataTypes.STRING,
    allowNull:false,
    validate:{
      notEmpty:true,
    },
  },
  role:{
    type:DataTypes.STRING,
    defaultValue:'user',
    validate:{
      isIn:[['admin','user','Admin','User','ADMIN','USER']]
    }
  },
  token: {
    type: DataTypes.STRING,
  },
});

User.beforeCreate(async (user,options)=>{
  const enPassword = await bcrypt.hash(user.password,8)
  user.password = enPassword
  console.log(user)
})

User.sync()
  .then(() => {
    console.log("user model synced");
  })
  .catch((error) => {
    console.log(error);
  });

module.exports = { User };
