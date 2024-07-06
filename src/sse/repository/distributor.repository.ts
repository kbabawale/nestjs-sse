import { Injectable, Logger } from '@nestjs/common';
import { InjectModel, InjectConnection } from '@nestjs/mongoose';
import { Model, Connection } from 'mongoose';
import { AbstractRepository } from 'src/util/database/abstract.repository';
import { Distributor } from '../schema/distributor.schema';

@Injectable()
export class DistributorRepository extends AbstractRepository<Distributor> {
  protected readonly logger = new Logger(DistributorRepository.name);

  constructor(
    @InjectModel(Distributor.name) distributorModel: Model<Distributor>,
    @InjectConnection() connection: Connection,
  ) {
    super(distributorModel, connection);
  }
}
