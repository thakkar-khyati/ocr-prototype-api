const { Sequelize, DataTypes } = require("sequelize");
const dotenv = require("dotenv");
const bcrypt = require("bcrypt");

dotenv.config();
const sequelize = require("../db");
const Roles = require("./roles.model");

const User = sequelize.define("users", {
  _id: {
    type: DataTypes.UUID,
    primaryKey: true,
    allowNull: false,
    defaultValue: Sequelize.UUIDV4,
  },
  first_name: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
    },
  },
  last_name: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
    },
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      notEmpty: true,
      isEmail: true,
    },
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
      notIn: [["passoword", "PASSWORD"]],
      isStrongPassword: function (value) {
        const passwordRegex =
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[a-zA-Z\d@$!%*?&]{8,}$/;
        if (!passwordRegex.test(value)) {
          throw new Error("invalid password");
        }
      },
    },
  },
  phone_no: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isIndianMobileNumber: function (value) {
        const mobileNumberRegex =
          /^(?:(?:\+|0{0,2})91(\s*[\-]\s*)?|[0]?)?[6789]\d{9}$/;
        if (!mobileNumberRegex.test(value)) {
          throw new Error("Invalid Indian Number");
        }
      },
    },
  },
  organization_name: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
    },
  },
  country: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
    },
  },
  avatar: {
    type: DataTypes.STRING,
  },
  is_active: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  is_verified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
});

User.beforeSave(async (user, options) => {
  const enPassword = await bcrypt.hash(user.password, 8);
  user.password = enPassword;
  console.log(user);
});

User.belongsTo(Roles, { foreignKey: "role_id" });
Roles.hasMany(User, { foreignKey: "role_id" });

User.sync({ alter: true })
  .then(() => {
    console.log("user model synced");
  })
  .catch((error) => {
    console.log(error);
  });

module.exports = { User };
