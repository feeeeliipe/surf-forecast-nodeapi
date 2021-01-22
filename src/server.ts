import './util/module-alias';
import { Server } from '@overnightjs/core';
import bodyParser from 'body-parser';
import { ForecastController } from './controllers/forecast';
import { Application } from 'express';
import * as database from '../src/database';
import { BeachesController } from './controllers/beaches';
import dotenv from 'dotenv';
import { InternalError } from './util/errors/internal-error';

dotenv.config();

class ServerStartupError extends Error {
  constructor(message: string) {
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class SetupServer extends Server {
  constructor(private port = 3000) {
    super();
  }

  public async init(): Promise<void> {
    this.checkEnviromentVariable('STORMGLASS_API_TOKEN');
    this.setupExpress();
    this.setupControllers();
    await this.setupDatabase();
  }

  private checkEnviromentVariable(variableName: string) {
    if (!process.env[variableName]) {
      throw new ServerStartupError(
        `Enviroment variable called "${variableName}" must be provided to startup the server!`
      );
    }
  }

  private setupExpress(): void {
    this.app.use(bodyParser.json());
  }

  private setupControllers(): void {
    const forecastController = new ForecastController();
    const beachesController = new BeachesController();
    this.addControllers([forecastController, beachesController]);
  }

  private async setupDatabase(): Promise<void> {
    await database.connect();
  }

  public startApplication(): void {
    this.app.listen(this.port, () => {
      console.info('Server is running on port: ', this.port);
    });
  }

  public async closeApplication(): Promise<void> {
    await database.close();
  }

  public getApp(): Application {
    return this.app;
  }
}
