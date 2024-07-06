import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';

import { AbstractDocument } from 'src/util/database/abstract.schema';
import {
  CostBreakDownField,
  DispatchOperatorField,
  DistributorField,
  ItemsField,
  OrderPaymentField,
  OrderRetailerField,
} from '../model/sse.model';

@Schema({
  versionKey: false,
  timestamps: true,
  collection: 'order',
  toJSON: { getters: true },
})
export class Order extends AbstractDocument {
  @Prop({ required: true, default: 'ORDER_CREATED' })
  status: string;

  @Prop({ required: true, type: mongoose.Schema.Types.Mixed, default: {} })
  retailer: OrderRetailerField;

  @Prop({ type: mongoose.Schema.Types.Mixed, default: { status: false } })
  payment: OrderPaymentField;

  @Prop({ type: mongoose.Schema.Types.Mixed, default: {} })
  dispatchOperator: DispatchOperatorField;

  @Prop({ type: mongoose.Schema.Types.Mixed, default: {} })
  distributor: DistributorField;

  @Prop({ type: mongoose.Schema.Types.Mixed, default: [] })
  items: ItemsField[];

  @Prop({ type: mongoose.Schema.Types.Mixed, default: {} })
  costBreakdown?: CostBreakDownField;
}

const OrderSchema = SchemaFactory.createForClass(Order);
OrderSchema.index({
  'dispatchOperator.fullname': 'text',
});
export { OrderSchema };
