export interface OTPField {
  password: string;
  created_at: string;
}

export interface DriverVehicleField {
  model: string;
  make: string;
  numberPlate: string;
  color: string;
  id?: string;
}

export interface DriverGuarantor {
  firstName: string;
  lastName: string;
  email: string;
  address: string;
  verified: boolean;
}

export interface DriverNextOfKin {
  firstName: string;
  lastName: string;
  phone: string;
  relationship: string;
  address: string;
  verified: boolean;
}

export enum DriverAgeRange {
  '18-24' = '18-24',
  '25-34' = '25-34',
  '35-44' = '35-44',
  '45-54' = '45-54',
  'Above 55' = 'Above 55',
}

export interface VehicleField {
  model: string;
  make: string;
  numberPlate: string;
  color: string;
  id?: string;
}
export class DispatchOperatorField {
  fullname: string;
  profileImage?: string;
  phone: string;
  id: string;
  vehicle: VehicleField;
  type?: string;
}

export interface AccompanyingDocumentField {
  title: string;
  fileURL?: string;
  filePublicID?: string;
  fileSignature?: string;
  issueDate?: Date;
  expiryDate?: Date;
}

export enum MeansOfPayment {
  CASH = 'CASH',
  DEBITCARD = 'DEBITCARD',
}

export enum OrderStatus {
  ORDER_CREATED = 'ORDER_CREATED', 
  ORDER_PROCESSED = 'ORDER_PROCESSED',
  HEADING_TO_PICKUP = 'HEADING_TO_PICKUP',
  HEADING_TO_DROPOFF = 'HEADING_TO_DROPOFF',
  ORDER_DELIVERED = 'ORDER_DELIVERED', 
}
export enum TripStatus {
  HEADING_TO_PICKUP = 'HEADING_TO_PICKUP',
  HEADING_TO_DROPOFF = 'HEADING_TO_DROPOFF',
  COMPLETE = 'COMPLETE',
}
export interface OrderPaymentField {
  status: boolean;
  meansOfPayment: MeansOfPayment;
  paymentRef?: PaystackResponse;
}
export interface TripOrderField {
  orderID: string;
  distributorID: string;
}
export interface OrderRetailerField {
  id: string;
  businessName: string;
  email: string;
  profilePhoto: string;
  address: string;
}
export interface PaystackResponse {
  message?: string;
  redirecturl?: string;
  reference?: string;
  status?: string;
  trans?: string;
  transaction?: string;
  trxref?: string;
}
export interface TripPinField {
  pin: number;
  confirmed: boolean;
}
export interface ItemsField {
  name: string;
  id: string;
  price: number;
  quantity: number;
  image?: string;
}

export interface DistributorField {
  name: string;
  id: string;
  profilePhoto?: string;
  address: string;
}
export interface CostBreakDownField {
  /**
   * @type {number}
   * total amount of goods purchased
   */
  items: number;
  /**
   * @type {number}
   * booking fee
   */
  booking: number;
  /**
   * @type {number}
   * delivery fee
   */
  delivery: number;
  /**
   * @type {number}
   * tax fee
   */
  tax: number;
}

export enum RequestsType {
  'UPDATEEMAIL' = 'UPDATEEMAIL',
  'UPDATERETAILERDETAILS' = 'UPDATERETAILERDETAILS',
  'UPDATEDRIVERDETAILS' = 'UPDATEDRIVERDETAILS',
  'VERIFYDRIVER' = 'VERIFYDRIVER',
}

export interface SavedInventoryField {
  inventory_id: string;
}

export interface MongoWatchResponse<T> {
  operationType: 'insert' | 'delete' | 'update' | 'create';
  _id: { data: any };
  fullDocument: T;
  documentKey: { _id: any };
  ns: any;
  txnNumber: number;
  updateDescription: {
    updatedFields: Partial<T>;
    removedFields: [];
    truncatedArrays: [];
  };
}

export const NEW_RETAILER_EVENT_NAME = 'new:retailer';
export const NEW_DRIVER_EVENT_NAME = 'new:driver';
export const DRIVER_VERIFICATION_EVENT_NAME = 'driver_verification';
export const NEW_ADMIN_EVENT_NAME = 'new:admin';
export const NEW_ADMIN_REQUESTS_EVENT_NAME = 'new:admin:requests';
export const NEW_ORDER_EVENT_NAME = 'new:order';
export const ORDER_STATUS_CHANGE_EVENT_NAME = 'order:status:change';
export const NEW_DELIVERY_EVENT_NAME = 'new:delivery';
export const NEW_DISTRIBUTOR_EVENT_NAME = 'new:distributor';
export const NEW_DELIVERED_ORDER_EVENT_NAME = 'new:delivered:order';
export const NEW_PROCESSED_ORDER_EVENT_NAME = 'new:processed:order';
