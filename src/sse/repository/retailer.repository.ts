import { Injectable, Logger } from '@nestjs/common';
import { InjectModel, InjectConnection } from '@nestjs/mongoose';
import { Model, Connection } from 'mongoose';
import { Retailer } from '../schema/retailer.schema';
import { AbstractRepository } from 'src/util/database/abstract.repository';

@Injectable()
export class RetailerRepository extends AbstractRepository<Retailer> {
  protected readonly logger = new Logger(RetailerRepository.name);

  constructor(
    @InjectModel(Retailer.name) retailerModel: Model<Retailer>,
    @InjectConnection() connection: Connection,
  ) {
    super(retailerModel, connection);
  }
}
