import { Injectable, Logger } from '@nestjs/common';
import { InjectModel, InjectConnection } from '@nestjs/mongoose';
import { Model, Connection } from 'mongoose';
import { AdminRequests } from '../schema/requests.schema.';
import { AbstractRepository } from 'src/util/database/abstract.repository';

@Injectable()
export class RequestsRepository extends AbstractRepository<AdminRequests> {
  protected readonly logger = new Logger(RequestsRepository.name);

  constructor(
    @InjectModel(AdminRequests.name) requestsModel: Model<AdminRequests>,
    @InjectConnection() connection: Connection,
  ) {
    super(requestsModel, connection);
  }
}
