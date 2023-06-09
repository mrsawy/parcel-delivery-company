import { Sequelize, DataTypes } from "sequelize";

const parcelFunction = (sequelize: Sequelize) => {
  const parcel = sequelize.define("parcel", {
    id: {
      primaryKey: true,
      type: DataTypes.INTEGER,
      autoIncrement: true,
    },
    weight: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 0,
    },
    deliveryAddress: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: `Egypt/cairo`,
    },
  });

  return parcel;
};
export default parcelFunction;
