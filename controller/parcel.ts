import express, { Request, Response } from "express";
import sequelize, { Parcel, Truck } from "./../database/database";

const getAllParcels = async (req: Request, res: Response) => {
  try {
    const parcels = await Parcel.findAll();

    if (parcels.length) {
      res.status(200);
      return res.json(parcels);
    } else {
      res.status(404);
      return res.json({ error: "Parcels not found" });
    }
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getOneParcel = async (req: Request, res: Response) => {
  try {
    const { parcelId } = req.params;
    const parcel = await Parcel.findByPk(parcelId);
    if (parcel) {
      res.status(200);
      res.json(parcel);
    } else {
      res.status(404);
      res.json({ error: "Parcels not found" });
    }
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getParcelWeight = async (req: Request, res: Response) => {
  try {
    const parcelId = req.params.parcelId;
    const weight = await Parcel.findByPk(parcelId, {
      attributes: ["weight"],
    });
    return weight
      ? (() => {
          res.status(200);
          res.json(weight);
        })()
      : (() => {
          res.status(404);
          res.json({ error: "Parcels not found" });
        })();
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const createParcel = async (req: Request, res: Response) => {
  try {
    const { weight, deliveryAddress, truckId } = req.body;
    if (truckId) {
      const truck = await Truck.findByPk(truckId);
      if (!truck) {
        res.status(500);
        res.json({ error: "wrong truckID" });
        return;
      }
    }
    const newlyCreatedParcel = await Parcel.create({
      weight,
      deliveryAddress,
      truckId,
    });
    if (newlyCreatedParcel) {
      res.status(201);
      res.json(newlyCreatedParcel);
    } else {
      res.status(500);
      res.json({ error: "Internal Server Error" });
    }
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getAllParcelsInTruckById = async (req: Request, res: Response) => {
  try {
    const { truckId } = req.params;
    const parcels = await Parcel.findAll({ where: { truckId } });
    if (parcels.length) {
      res.status(200);
      res.json({ parcels, parcelsNumber: parcels.length });
    } else {
      res.status(404);
      res.json({ error: `no parcels found` });
    }
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const deleteParcel = async (req: Request, res: Response) => {
  try {
    const { parcelId } = req.params;
    const parcelToBeDeleted = await Parcel.destroy({ where: { id: parcelId } });
    if (parcelToBeDeleted) {
      res.status(204);
      res.json({ massage: `deleted succsesfully` });
      return;
    } else {
      res.status(404);
      res.json({ error: "no parcels where deleted" });
      return;
    }
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const loadParcelToTruck = async (req: Request, res: Response) => {
  try {
    const { parcelId, truckId } = req.body;

    const truck = await Truck.findByPk(truckId);
    if (!truck) {
      res.status(404);
      res.json({ error: "wrong truck ID" });
      return;
    }

    const parcelTobeLoaded = await Parcel.update(
      { truckId },
      { where: { id: parcelId } }
    );

    if (parcelTobeLoaded[0]) {
      res.status(200);
      res.json({ massage: `loaded succsesfully` });
      return;
    } else {
      res.status(404);
      res.json({ error: "no parcels where loaded" });
      return;
    }
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const unloadParcel = async (req: Request, res: Response) => {
  try {
    const { parcelId } = req.body;
    if (!parcelId) {
      res.status(404);
      res.json({ massage: `must specify the parcel ID` });
      return;
    }
    const parcelTobeUnLoaded = await Parcel.update(
      { truckId: null },
      { where: { id: parcelId } }
    );
    if (parcelTobeUnLoaded[0]) {
      res.status(200);
      res.json({ massage: `unloaded succsesfully` });
      return;
    } else {
      res.status(404);
      res.json({ error: "no parcels where unloaded (wrong ID)" });
    }
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export {
  getAllParcels,
  getOneParcel,
  getParcelWeight,
  createParcel,
  getAllParcelsInTruckById,
  deleteParcel,
  loadParcelToTruck,
  unloadParcel,
};
