import express, { Request, Response } from "express";
// import bodyParser from 'body-parser';
// import connection from './db';
import sequelize from "./database/database";
import parcerRouter from "./router/parcel";
import truckRouter from "./router/truck";
// '''''''''
const app = express();
app.use(express.json()); 

const port = 3000;





app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET, POST, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});









app.get(`/`, (req:Request, res:Response) => {
  res.send(
    `<div
    style= "display:flex;margin-top:40vh;"
    ><h1 style="color:red;display:inline-block;margin:0 auto;"> Hello ^_^ </h1></div>`
  );
});

app.use(`/parcel`, parcerRouter);
app.use(`/truck`, truckRouter);



app.all('*', (r, res) => {
  res.status(404).json({ error: ' Sorry , Endpoint wes not found' });
});



sequelize
  .sync({ alter: true })
  .then(() => {
    app.listen(port, () => {
      console.log(`listenning`);
    });
  })
  .catch((e) => {
    console.log(`couldnt connect to db err: ${e}`);
  });
