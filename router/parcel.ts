import express from "express";
const router = express.Router();

import * as parcelController from "./../controller/parcel";

router.get(`/all-parcels`, parcelController.getAllParcels);

router.get(`/one-parcel/:parcelId`, parcelController.getOneParcel);

router.get(`/parcel-weight/:parcelId`, parcelController.getParcelWeight);

router.get(
  `/get-all-parcels-in-truck/:truckId`,
  parcelController.getAllParcelsInTruckById
);

router.post(`/create-parcel`, parcelController.createParcel);

router.put(`/unload-parcel`, parcelController.unloadParcel);

router.put(`/load-parcel`, parcelController.loadParcelToTruck);

router.delete(`/delete-parcel/:parcelId`, parcelController.deleteParcel);

export default router;