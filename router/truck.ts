
import express from "express";
const router = express.Router();

import {unloadTruck,deleteTruck,getCurrentParcelNumberAndTruckWeight,createTruck,getAllTrucks,getOneTruck,getTruckWeightBeforeLoading} from "./../controller/truck"

router.get(`/all-trucks`,getAllTrucks)

router.get(`/one-truck/:truckId`,getOneTruck)

router.get(`/truck-weight-before-loading/:truckId`,getTruckWeightBeforeLoading)

router.get(`/truck-weight-and-parcel-number/:truckId`,getCurrentParcelNumberAndTruckWeight)

router.post(`/create-truck`,createTruck)

router.delete(`/delete-truck/:truckId`,deleteTruck)

router.put(`/unload-truck`, unloadTruck)


export default router ;