//type imports
import { Express } from "express";
import { Client as MQTTClient } from "mqtt";
//base imports
import express from "express";
import hbs from 'hbs';
import path from 'path';
import bodyParser from "body-parser";
//middleware imports
import session from 'express-session';
import helmet from "helmet";
import dotenv from "dotenv";
import passport from "passport";
//pg imports
import { Pool } from "pg";
//mqtt imports
import mqtt from "mqtt";
//internal imports
import { setupCubeDB } from "./model/cube";
import { setupPassport } from "./utils/passport_utils";
import { setupMQTT } from "./utils/mqtt_utils";
import { router as viewRoutes } from "./views/views";
import { router as apiRoutes } from "./api/api";

//Parse environment variables
dotenv.config();

//Connect to database
export const pool: Pool = new Pool();

//Setup cube database
setupCubeDB();

//Setup passport
setupPassport();

//Connect to MQTT broker
let mqttUrl: string = process.env.MQTTURL || 'test.mosquitto.org';
let mqttPort: number = parseInt(process.env.MQTTPORT || '1883');
export const mqttClient: MQTTClient = mqtt.connect('mqtt://'+mqttUrl, {port: mqttPort});

mqttClient.on('connect', function() {
    console.log('Connected to MQTT server.');
    setupMQTT();
});

//Create express app
const PORT: number = parseInt(process.env.PORT || '3000');
const app: Express = express();

//Register template engine
app.set('views', './templates');
app.set('view engine', 'hbs');
//Register partials
hbs.registerPartials(__dirname + '/templates/partials', function() {});

//Register static path
app.use('/static', express.static(path.join(__dirname, './public')));

//Add middleware
app.use(helmet());
app.use(session({
    secret: process.env.SESSIONSECRET || 'secret',
    //Check if session store implements touch
    resave: false,
    //Because of cookie banner
    saveUninitialized: false
}))
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(passport.initialize());
app.use(passport.session());

//Delegate routing
app.use('/', viewRoutes);
app.use('/api', apiRoutes);

//Start server
app.listen(PORT, () => console.log(`Running on port: ${PORT}`));