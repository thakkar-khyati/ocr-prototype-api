const { DataTypes } = require("sequelize");
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
  firstName: {
    type: DataTypes.STRING,
    allowNull:false,
    validate:{
      notEmpty:true
    }
  },
  lastName: {
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
  phoneNo:{
    type: DataTypes.STRING,
    allowNull:false,
    validate:{
      isIndianMobileNumber: function(value){
        const mobileNumberRegex = /^(?:(?:\+|0{0,2})91(\s*[\-]\s*)?|[0]?)?[6789]\d{9}$/;
        if(!mobileNumberRegex.test(value)){
          throw new Error("Invalid Indian Number")
        }
      }
    }
  },
  organizationName:{
    type:DataTypes.STRING,
    allowNull:false,
    validate:{
      notEmpty:true
    }
  },
  country:{
    type:DataTypes.STRING,
    allowNull:false,
    validate:{
      notEmpty:true
    }
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
