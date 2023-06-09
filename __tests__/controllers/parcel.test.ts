//''
import { Request, Response } from "express";
import { request } from "http";
// import { it } from "node:test";

import {
  getAllParcels,
  getOneParcel,
  getParcelWeight,
  createParcel,
  getAllParcelsInTruckById,
  deleteParcel,
  loadParcelToTruck,
  unloadParcel,
} from "./../../controller/parcel";
jest.mock("./../../database/database");
import { Parcel, Truck } from "./../../database/database";

describe(`getting the parcels`, () => {
  const json = jest.fn();
  const status = jest.fn();
  const body = {};
  const params = {};

  const res = { json, status } as unknown as Response<any, Record<string, any>>;
  const req = { body, params } as unknown as Request<any, Record<string, any>>;

  it(`should return all parcels with status code of 200`, async () => {
    Parcel.findAll = jest.fn().mockResolvedValue([
      { id: 1, name: "Parcel 1" },
      { id: 2, name: "Parcel 2" },
    ]);
    await getAllParcels({} as Request, res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledTimes(1);
  });

  it(`should return an empty array and status code 404 if there is no parcels`, async () => {
    Parcel.findAll = jest.fn().mockResolvedValue([]);
    res.json = jest.fn();
    res.status = jest.fn();

    await getAllParcels({} as Request, res);
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledTimes(1);
  });

  it(`should return the parcel and status code of 200 when trying to get one existing parcel`, async () => {
    Parcel.findByPk = jest.fn().mockResolvedValue({ id: 1, name: `parcel` });
    res.json = jest.fn();
    res.status = jest.fn();

    req.params = { parcelId: 1 };
    await getOneParcel(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledTimes(1);
  });

  it(`should return a status code of 404 when there is no parcel found by the given ID`, async () => {
    Parcel.findByPk = jest.fn().mockResolvedValue(null);
    res.json = jest.fn();
    res.status = jest.fn();
    req.params = { parcelId: 1 };
    await getOneParcel(req, res);
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledTimes(1);
  });

  it(`should return the weight and status code of 200 if the ID is correct`, async () => {
    Parcel.findByPk = jest.fn().mockResolvedValue({ weight: 10 });
    res.json = jest.fn();
    res.status = jest.fn();
    req.params = { parcelId: 1 };
    await getParcelWeight(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledTimes(1);
  });

  it(`should not get the weith and respond with error and status code of 404 if the ID is not correct`, async () => {
    Parcel.findByPk = jest.fn().mockResolvedValue(null);
    res.json = jest.fn();
    res.status = jest.fn();
    req.params = { parcelId: 1 };
    await getParcelWeight(req, res);
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledTimes(1);
  });

  it(`should get all parcels in truck specified by ID with status code of 200 id if there is any`, async () => {
    req.params = { truckId: 1 };
    Parcel.findAll = jest.fn().mockResolvedValue([
      { id: 1, name: "Parcel 1" },
      { id: 2, name: "Parcel 2" },
    ]);

    res.json = jest.fn();
    res.status = jest.fn();
    await getAllParcelsInTruckById(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledTimes(1);
  });

  it(`should respond with status code 500 with an error massage if there is no parcels are found in the wanted truck`, async () => {
    req.params = { truckId: 1 };
    Parcel.findAll = jest.fn().mockResolvedValue([]);
    res.json = jest.fn();
    res.status = jest.fn();
    await getAllParcelsInTruckById(req, res);
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledTimes(1);
  });
});

describe(`creating and updating the parcels`, () => {
  const json = jest.fn();
  const status = jest.fn();
  const body = {};
  const params = {};

  const res = { json, status } as unknown as Response<any, Record<string, any>>;
  const req = { body, params } as unknown as Request<any, Record<string, any>>;

  it(`should create a parcel and respond with status code 201 if all inputs are valid`, async () => {
    req.body = { weight: 20, deliveryAddress: `home`, truckId: 1 };
    Parcel.create = jest.fn().mockResolvedValue({ id: 1, weight: 2 });
    Truck.findByPk = jest.fn().mockResolvedValue({ id: 1 });
    res.json = jest.fn();
    res.status = jest.fn();
    await createParcel(req, res);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledTimes(1);
  });

  it(`should not create the parcel and respond with status code 500 if the truck Id is not valid`, async () => {
    req.body = { weight: 20, deliveryAddress: `home`, truckId: -1 };
    Parcel.create = jest.fn().mockResolvedValue({ id: 1, weight: 2 });
    Truck.findByPk = jest.fn().mockResolvedValue(null);
    res.json = jest.fn();
    res.status = jest.fn();
    await createParcel(req, res);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledTimes(1);
  });

  //  deleteParcel
  it(`should delete the parcel and respond with status code 204 if the parcel id is valid`, async () => {
    req.params = { truckId: 1 };
    Parcel.destroy = jest.fn().mockResolvedValue(1);

    res.json = jest.fn();
    res.status = jest.fn();
    await deleteParcel(req, res);

    expect(res.status).toHaveBeenCalledWith(204);
    expect(res.json).toHaveBeenCalledTimes(1);
  });

  it(`should not delete any parcel and respond with status code 404 if the parcel id is not valid`, async () => {
    req.params = { truckId: 1 };
    Parcel.destroy = jest.fn().mockResolvedValue(0);

    res.json = jest.fn();
    res.status = jest.fn();
    await deleteParcel(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledTimes(1);
  });

  it(`should load the parcel to the specified truck & respond with status code 200 if inputs are valid`, async () => {
    req.body = { parcelId: 1, truckId: 1 };
    Parcel.update = jest.fn().mockResolvedValue([1]);
    Truck.findByPk = jest.fn().mockResolvedValue({ id: 1 });
    res.json = jest.fn();
    res.status = jest.fn();
    await loadParcelToTruck(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledTimes(1);
  });

  it(`should not load the parcel and respond with status code 404 and error massage if the inputs were unvalid`, async () => {
    Parcel.update = jest.fn().mockResolvedValue([0]);
    Truck.findByPk = jest.fn().mockResolvedValue(null);
    res.json = jest.fn();
    res.status = jest.fn();
    await loadParcelToTruck(req, res);
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledTimes(1);
  });

  it(`should unload the parcel with response of status code 200 if the parcel id is correct`, async () => {
    req.body = { parcelId: 1 };
    Parcel.update = jest.fn().mockResolvedValue([1]);
    res.json = jest.fn();
    res.status = jest.fn();
    await unloadParcel(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledTimes(1);
  });

  it(`should not unload the parcel & give an error massage with code 404 if the parcel id is not specified`, async () => {
    req.body = { parcelId: null };
    Parcel.update = jest.fn().mockResolvedValue([1]);
    res.json = jest.fn();
    res.status = jest.fn();
    await unloadParcel(req, res);
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledTimes(1);
  });

  it(`should not unload the parcel & give an error massage with code 404 if the parcel id is not correct`, async () => {
    req.body = { parcelId: -1 };
    Parcel.update = jest.fn().mockResolvedValue([0]);
    res.json = jest.fn();
    res.status = jest.fn();
    await unloadParcel(req, res);
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledTimes(1);
  });
});
