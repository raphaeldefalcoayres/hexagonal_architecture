import express, { Request, response, Response } from "express";
import PostgreSQLAdapter from "./adapters/outbound/PostgreSQLAdapter";
import ParkedCarDatabaseRepository from "./application/ports/outbound/ParkedCarDatabaseRepository";
import Checkin from "./application/usecases/Checkin";
import Checkout from "./application/usecases/Checkout";
import GetParkedCars from "./application/usecases/GetParkedCars";

const app = express();
app.use(express.json());
const connection = new PostgreSQLAdapter();
const parkedCarRepository = new ParkedCarDatabaseRepository(connection);

app.post("/checkin", async function (request: Request, response: Response) {
  const checkin = new Checkin(parkedCarRepository);
  await checkin.execute({
    plate: request.body.plate,
    checkinDate: request.body.checkinDate,
  });
  response.end();
});
app.get("/parked_cars", async function (request: Request, response: Response) {
  const getParkedCars = new GetParkedCars(parkedCarRepository);
  const parkedCars = await getParkedCars.execute();
  response.json(parkedCars);
});
app.post("/checkout", async function (request: Request, response: Response) {
  const checkout = new Checkout(parkedCarRepository);
  const ticket = await checkout.execute({
    plate: request.body.plate,
    checkoutDate: request.body.checkoutDate,
  });
  response.json(ticket);
});

app.listen(3000);
