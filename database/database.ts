import { Sequelize } from "sequelize";
import parcelFunction from "../model/parcel";
import truckFunction from "../model/truck";
const sequelize = new Sequelize(`parcel_delivery`, `root`, `Dfg456h7j8!`, {
  host: "localhost",
  dialect: "mysql",
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
  logging: console.log,
});

const Parcel = parcelFunction(sequelize);
const Truck = truckFunction(sequelize);

Truck.hasMany(Parcel);
Parcel.belongsTo(Truck, { onDelete: "SET NULL", foreignKey: `truckId` });

export default sequelize;
export { Parcel, Truck };
