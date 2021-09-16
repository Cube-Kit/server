//type imports
import { Router, Request, Response } from "express";
import { Cube, CubeDetailDataObject, Sensor } from "../types";
//express imports
import express from "express";
//internal imports
import { getActuatorTypes, getCubes, getCubeWithId, getSensorTypes, updateCubeWithId } from "../utils/db_cube_utils";
import { compareCubes } from "../utils/utils";
import { authenticateUser } from "../utils/passport_utils";

export var router: Router = express.Router();

router.get('/', authenticateUser, (req: Request, res:Response) => {
    getCubes()
        .then((cubes: Array<Cube>) => {
            let data = {
                title: 'Cube Overview',
                cubes: cubes.sort(compareCubes),
            }

            res.render('cubes-list', data);
        })
        .catch ((e: Error) => {
            console.log(e.stack);
            res.status(501).send("view error");
        });
});

router.get('/cubes/:cubeId', authenticateUser, (req, res) => {

    getCubeWithIdView(req, res);
});

router.post('/cubes/:cubeId', authenticateUser, async (req, res) => {

    let cubeId: string = req.params['cubeId'];
    let variables = req.body;

    await updateCubeWithId(cubeId, variables);
    
    getCubeWithIdView(req, res);
});

function getCubeWithIdView (req: Request, res: Response): void {

    let cubeId: string = req.params['cubeId'];

    Promise.all([getCubeWithId(cubeId), getSensorTypes(), getActuatorTypes()])
        .then((values: Array<any>) => {

            let cube: Cube = values[0];
            let additional_sensors = values[1].filter((sensor: Sensor) => {
                return !cube.sensors.includes(sensor.name.trim())
            });
            let additional_actuators = values[2].filter((actuator: string) => {
                return !cube.actuators.includes(actuator.trim())
            });
            
            let data: CubeDetailDataObject = {
                'title': 'Cube',
                'cube':  cube,
                'additional_sensors': additional_sensors,
                'additional_actuators': additional_actuators
            }

            res.render('cube-detail', data);
        })
        .catch ((e: Error) => {
            console.log(e.stack);
            res.status(501).send("view error");
        });
}