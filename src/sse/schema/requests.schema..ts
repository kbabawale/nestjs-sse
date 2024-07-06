import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { AbstractDocument } from 'src/util/database/abstract.schema';
import { RequestsType } from '../model/sse.model';

@Schema({
  versionKey: false,
  timestamps: true,
  collection: 'adminRequests',
  toJSON: { getters: true },
})
export class AdminRequests extends AbstractDocument {
  @Prop({ type: mongoose.Schema.Types.Mixed })
  type: RequestsType;

  @Prop({ type: mongoose.Schema.Types.Mixed, default: {} })
  payload: any;

  @Prop({ enum: ['Pending', 'Approved', 'Declined'], default: 'Pending' })
  status: string;

  @Prop({ default: '' })
  approvedBy: string;

  @Prop({ default: '' })
  approvalDate: Date;
}

export const RequestsSchema = SchemaFactory.createForClass(AdminRequests);
