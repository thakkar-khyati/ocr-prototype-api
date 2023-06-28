const { DataTypes } = require("sequelize");

const sequelize = require("../db");

const Process = sequelize.define("ocr-process", {
  process_id: {
    type: DataTypes.UUID,
    primaryKey: true,
    allowNull: false,
    defaultValue: DataTypes.UUIDV4,
  },
  user_id: {
    type: DataTypes.UUID,
    allowNull: true,
  },
  status: {
    type: DataTypes.STRING,
  },
  response: {
    type: DataTypes.JSON,
  },
});

Process.sync()
  .then(() => {
    console.log("process model synced");
  })
  .catch((error) => {
    console.log(error);
  });

module.exports = Process;
