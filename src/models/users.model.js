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
  first_name: {
    type: DataTypes.STRING,
    allowNull:false
  },
  last_name: {
    type: DataTypes.STRING,
    allowNull:false
  },
  email: {
    type: DataTypes.STRING,
    allowNull:false
  },
  password: {
    type: DataTypes.STRING,
    allowNull:false
  },
  token: {
    type: DataTypes.STRING,
  },
});

const getAuthToken = async (id) => {
  const payload = { _id: id };
  const secret = process.env.JWT_SECRET;
  const token = jwt.sign(payload, secret);
  await User.update({ token: token }, { where: { _id: id } });
  const user = await User.findByPk(id);
  return user;
};

const encodePassword = async (password, id) => {
  const enPassword = await bcrypt.hash(password, 8);
  await User.update({ password: enPassword }, { where: { _id: id } });
  const user = await User.findByPk(id);
  return user;
};

const findByCredentials = async(email,password)=>{
    const promise = new Promise(async(res,rej)=>{
        const user = await User.findOne({where:{email:email}})
        if(!user){
            rej("incorrect email or password")
        }
        else{
            const isMatch = await bcrypt.compare(password,user.password)
            if(!isMatch){
                rej("incorrect email or password")
            }
        }
        res(user)
    })
    return promise
}

User.sync()
  .then(() => {
    console.log("user model synced");
  })
  .catch((error) => {
    console.log(error);
  });

module.exports = { User, getAuthToken, encodePassword ,findByCredentials};
