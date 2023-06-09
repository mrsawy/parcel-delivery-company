//''
import { Request, Response } from "express";

import {
  getAllTrucks,
  getOneTruck,
  getTruckWeightAfterLoading,
  getTruckWeightBeforeLoading,
  deleteTruck,
  unloadTruck,
  createTruck,
} from "./../../controller/truck";
jest.mock("./../../database/database");
import { Parcel, Truck } from "./../../database/database";

describe(`getting the trucks`, () => {
  const json = jest.fn();
  const status = jest.fn();
  const body = {};
  const params = {};

  const res = { json, status } as unknown as Response<any, Record<string, any>>;
  const req = { body, params } as unknown as Request<any, Record<string, any>>;

  it(`should get all trucks with status code of 200 if there are any founded trucks`, async () => {
    Truck.findAll = jest.fn().mockResolvedValue([
      { id: 1, name: "Truck 1" },
      { id: 2, name: "Truck 2" },
    ]);
    await getAllTrucks({} as Request, res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledTimes(1);
  });

  it(`should respond with status code 404 if there is no trucks`, async () => {
    Truck.findAll = jest.fn().mockResolvedValue([]);
    const json = jest.fn();
    res.json = json;
    await getAllTrucks({} as Request, res);
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledTimes(1);
  });

  it(`should get the Truck and status code of 200 when trying to get one existing parcel`, async () => {
    Truck.findByPk = jest.fn().mockResolvedValue({ id: 1, name: `parcel` });
    res.json = jest.fn();
    res.status = jest.fn();

    req.params = { parcelId: 1 };
    await getOneTruck(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledTimes(1);
  });

  it(`should respond with a status code of 404 when there is no Truck found by the given ID`, async () => {
    Truck.findByPk = jest.fn().mockResolvedValue(null);
    res.json = jest.fn();
    res.status = jest.fn();
    req.params = { parcelId: 1 };
    await getOneTruck(req, res);
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledTimes(1);
  });

  it(`should get the before loading weight of the truck and status code of 200 if the ID is correct`, async () => {
    Truck.findByPk = jest.fn().mockResolvedValue({ weight: 10 });
    res.json = jest.fn();
    res.status = jest.fn();
    req.params = { parcelId: 1 };
    await getTruckWeightBeforeLoading(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledTimes(1);
  });

  it(`should not get the weith and respond with error and status code of 404 if the ID is not correct`, async () => {
    Truck.findByPk = jest.fn().mockResolvedValue(null);
    res.json = jest.fn();
    res.status = jest.fn();
    req.params = { truckId: 1 };
    await getTruckWeightBeforeLoading(req, res);
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledTimes(1);
  });

  it(`should get the After loading weight of the truck and status code of 200 if the ID is correct`, async () => {
    Truck.findByPk = jest
      .fn()
      .mockResolvedValue({ dataValues: { weight: 10 } });
    Parcel.findAll = jest
      .fn()
      .mockResolvedValue([
        { dataValues: { weight: 300 } },
        { dataValues: { weight: 400 } },
      ]);
    res.json = jest.fn();
    res.status = jest.fn();
    req.params = { parcelId: 1 };
    await getTruckWeightAfterLoading(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledTimes(1);
  });

  it(`should not get the after loading weight and respond with error and status code of 404 if the ID is not correct`, async () => {
    Truck.findByPk = jest.fn().mockResolvedValue(null);
    Parcel.findAll = jest.fn().mockResolvedValue([]);
    res.json = jest.fn();
    res.status = jest.fn();
    req.params = { truckId: 1 };
    await getTruckWeightAfterLoading(req, res);
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledTimes(1);
  });

  it(`should delete the Truck and respond with status code 204 if the Truck id is valid`, async () => {
    req.params = { truckId: 1 };
    Truck.destroy = jest.fn().mockResolvedValue(1);

    res.json = jest.fn();
    res.status = jest.fn();
    await deleteTruck(req, res);

    expect(res.status).toHaveBeenCalledWith(204);
    expect(res.json).toHaveBeenCalledTimes(1);
  });

  it(`should not delete any Truck and respond with status code 404 if the Truck id is not valid`, async () => {
    req.params = { truckId: 1 };
    Truck.destroy = jest.fn().mockResolvedValue(0);

    res.json = jest.fn();
    res.status = jest.fn();
    await deleteTruck(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledTimes(1);
  });


  it(`should create a Truck and respond with status code 201 if all inputs are valid`, async () => {
    req.body = { weight: 20, year: 2000, capacity: 1 , model:`BMW`};
    Truck.create = jest.fn().mockResolvedValue({ id: 1, weight: 2 });
    res.json = jest.fn();
    res.status = jest.fn();
    await createTruck(req, res);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledTimes(1);
  });

  it(`should not create the parcel and respond with status code 404 if the inputs are not valid`, async () => {   
    req.body = {};

    Parcel.create = jest.fn().mockResolvedValue(null);
    res.json = jest.fn();
    res.status = jest.fn();
    await createTruck(req, res);
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledTimes(1);
  });


  it(`should unload the truck with status code of 200 if the inputs are valid`, async () => {   
    req.body = {truckId:1};

    Parcel.update = jest.fn().mockResolvedValue([1]);
    res.json = jest.fn();
    res.status = jest.fn();
    await unloadTruck(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledTimes(1);
  });

  it(`should not to be able to unload the truck  & respond with status code of 404 if the inputs are invalid`, async () => {   
    req.body = {truckId:null};

    Parcel.update = jest.fn().mockResolvedValue([0]);
    res.json = jest.fn();
    res.status = jest.fn();
    await unloadTruck(req, res);
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledTimes(1);
  });

  






});
