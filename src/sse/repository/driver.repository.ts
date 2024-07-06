import { Injectable, Logger } from '@nestjs/common';
import { InjectModel, InjectConnection } from '@nestjs/mongoose';
import { Model, Connection } from 'mongoose';
import { AbstractRepository } from 'src/util/database/abstract.repository';
import { Driver } from '../schema/driver.schema';

@Injectable()
export class DriverRepository extends AbstractRepository<Driver> {
  protected readonly logger = new Logger(DriverRepository.name);

  constructor(
    @InjectModel(Driver.name) driverModel: Model<Driver>,
    @InjectConnection() connection: Connection,
  ) {
    super(driverModel, connection);
  }
}
