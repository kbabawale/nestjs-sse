import { Module } from '@nestjs/common';
import { SSEController } from './controller/sse.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Retailer, RetailerSchema } from './schema/retailer.schema';
import { Distributor, DistributorSchema } from './schema/distributor.schema';
import { Driver, DriverSchema } from './schema/driver.schema';
import { AdminRequests, RequestsSchema } from './schema/requests.schema.';
import { Order, OrderSchema } from './schema/order.schema';
import { RequestsRepository } from './repository/requests.repository';
import { OrderRepository } from './repository/order.repository';
import { RetailerRepository } from './repository/retailer.repository';
import { DriverRepository } from './repository/driver.repository';
import { DistributorRepository } from './repository/distributor.repository';
import { SSEService } from './service/sse.service';

@Module({
  imports: [
    MongooseModule.forFeatureAsync([
      {
        name: Retailer.name,
        useFactory: () => {
          const schema = RetailerSchema;

          return schema;
        },
      },
      {
        name: Distributor.name,
        useFactory: () => {
          const schema = DistributorSchema;

          return schema;
        },
      },
      {
        name: Driver.name,
        useFactory: () => {
          const schema = DriverSchema;

          return schema;
        },
      },
      {
        name: Order.name,
        useFactory: () => {
          const schema = OrderSchema;

          return schema;
        },
      },

      {
        name: AdminRequests.name,
        useFactory: () => {
          const schema = RequestsSchema;

          return schema;
        },
      },
    ]),
  ],
  controllers: [SSEController],
  providers: [
    SSEService,
    RequestsRepository,
    OrderRepository,
    RetailerRepository,
    DriverRepository,
    DistributorRepository,
  ],
})
export class SSEModule {}
