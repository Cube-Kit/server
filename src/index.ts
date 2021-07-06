import express, { Express, Request, Response } from "express";
import bodyParser from "body-parser";
import helmet from "helmet";
import dotenv from "dotenv";
import {router as apiRoutes} from "./api/api";

//Parse environment variables
dotenv.config();
//Create express app
const PORT = process.env.PORT || 3000;
const app: Express = express();
//const index = require('./routes/index')

//Add middleware
app.use(helmet());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//Delegate routing
app.get("/", apiRoutes);

//Start server
app.listen(PORT, () => console.log(`Running on port: ${PORT}`));