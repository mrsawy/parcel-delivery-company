import { Sequelize, DataTypes } from "sequelize";

const truckFunction = (sequelize: Sequelize) => {
  const truck = sequelize.define("truck", {
    id: {
      primaryKey: true,
      type: DataTypes.INTEGER,
      autoIncrement: true,
    },
    weight: {
      allowNull: false,
      type: DataTypes.FLOAT,
    },
    model: {
      type: DataTypes.STRING,
    },
    year: {
      type: DataTypes.INTEGER,
    },
    capacity: {
      type: DataTypes.FLOAT,
      allowNull: false,

    },
  });

  return truck;
};

export default truckFunction;
