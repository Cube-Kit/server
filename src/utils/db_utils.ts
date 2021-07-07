import {PoolClient, QueryResult} from 'pg';
import {pool} from "../index";

const cubes_table: string = "CREATE TABLE IF NOT EXISTS cubes (cube_id UUID NOT NULL, location CHAR(255) NOT NULL, sensors CHAR(5)[], actuators CHAR(5)[], PRIMARY KEY (cube_id))";
const sensor_data_table: string = "CREATE TABLE IF NOT EXISTS sensor_data (id SERIAL UNIQUE NOT NULL,sensor_type CHAR(5) NOT NULL, cube_id UUID NOT NULL, timestamp TIMESTAMPTZ NOT NULL, data NUMERIC NOT NULL, PRIMARY KEY (id), FOREIGN KEY(cube_id) REFERENCES cubes (cube_id))";

export function setupDB(): void {
    pool
        .connect()
        .then((client: PoolClient) => {
            client
                .query(cubes_table)
                .then((res: QueryResult) => {
                    console.log("Successfully created cubes table.");
                    client
                        .query(sensor_data_table)
                        .then((res: QueryResult) => {
                            console.log("Successfully created sensor_data table.")
                            client.release();
                        })
                        .catch(err => {
                            client.release();
                            console.log(err.stack);
                        });
                })
                .catch(err => {
                    client.release();
                    console.log(err.stack);
                });
        });
}

export function persistCube(cubeId: String, location: String, sensors: Array<String>, actuators: Array<String>) {
    
}

export function persistSensorData(sensorType: String, cubeId: String, timestamp: Date, data: String) {

}