import  { Request, Response } from "express";
import  { Parcel, Truck } from "./../database/database";


const createTruck = async (req: any, res: Response) => {
  const { model, weight, year, capacity } = req.body;

  try {
    if (!weight || !capacity) {
      res.status(404);
      res.json({ error: `invalid inputs` });
      return
    }

    const newlyCreatedTruck = await Truck.create({
      weight,
      model,
      year,
      capacity,
    });

    res.status(201);
    res.json(newlyCreatedTruck);
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error", err });
  }
};

const getAllTrucks = async (req: Request, res: Response) => {
  try {
    const allTrucks = await Truck.findAll();

    if (allTrucks.length) {
      res.status(200);
      return res.json(allTrucks);
    } else {
      res.status(404);
      return res.json({ error: "Internal Server Error (no trucks found)" });
    }
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getOneTruck = async (req: Request, res: Response) => {
  try {
    const truckId = req.params.truckId;
    const truck = await Truck.findByPk(truckId);

    if (truck) {
      res.status(200);
      res.json(truck);
      return;
    } else {
      res.status(404);
      res.json({ error: "Parcels not found" });
    }
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getTruckWeightBeforeLoading = async (req: Request, res: Response) => {
  try {
    const truckId = req.params.truckId;
    const weight = await Truck.findByPk(truckId, {
      attributes: ["weight"],
    });
    if (weight) {
      res.status(200);
      res.json(weight);
    } else {
      res.status(404);
      res.json({ error: "truck not found" });
    }
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getTruckWeightAfterLoading = async (req: Request, res: Response) => {
  try {
    const truckId = req.params.truckId;
    const weight = await Truck.findByPk(truckId, {
      attributes: ["weight"],
    });

    const weightBeforeLoading = weight?.dataValues?.weight ?? null;
    if (!weight) {
      res.status(404);
      res.json({ error: "truck weight not found" });
      return;
    }

    const parcels = await Parcel.findAll({
      where: { truckId: truckId },
      attributes: ["weight"],
    });

    const parcelsWeight = parcels
      .map((p) => p?.dataValues.weight)
      .reduce((sum, weight) => sum + weight, 0);

    const totalWeightAfterLoading = weightBeforeLoading + parcelsWeight;

    res.status(200);
    res.json(totalWeightAfterLoading);
  } catch (err) {
    res.status(500);
    res.json({ error: "Internal Server Error" });
  }
};

const deleteTruck = async (req: Request, res: Response) => {
  try {
    const { truckId } = req.params;
    const truckToBeDeleted = await Truck.destroy({ where: { id: truckId } });
    if (truckToBeDeleted) {
       res.status(204);res.json({ massage: `deleted succsesfully` });
    } else {
      res.status(404);res.json({ error: "no trucks where deleted" });
    }
  } catch (err) {
    res.status(500);res.json({ error: "Internal Server Error" });
  }
};

const unloadTruck = async (req: Request, res: Response) => {
  try {
    const { truckId } = req.body;
    const parcelsTobeUnLoaded = await Parcel.update(
      { truckId: null },
      { where: { truckId } }
    );

    if (parcelsTobeUnLoaded[0]) {
       res.status(200);res.json({ massage: `unloaded succses` });
    } else {
      res.status(404);res.json({ error: `no trucks where unloaded` });
    }
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export {
  unloadTruck,
  getTruckWeightAfterLoading,
  createTruck,
  getAllTrucks,
  getOneTruck,
  getTruckWeightBeforeLoading,
  deleteTruck,
};
