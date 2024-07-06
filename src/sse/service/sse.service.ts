import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RetailerRepository } from '../repository/retailer.repository';
import {
  DRIVER_VERIFICATION_EVENT_NAME,
  MongoWatchResponse,
  NEW_ADMIN_EVENT_NAME,
  NEW_ADMIN_REQUESTS_EVENT_NAME,
  NEW_DELIVERED_ORDER_EVENT_NAME,
  NEW_DISTRIBUTOR_EVENT_NAME,
  NEW_DRIVER_EVENT_NAME,
  NEW_ORDER_EVENT_NAME,
  NEW_PROCESSED_ORDER_EVENT_NAME,
  NEW_RETAILER_EVENT_NAME,
  ORDER_STATUS_CHANGE_EVENT_NAME,
} from '../model/sse.model';
import { Retailer } from '../schema/retailer.schema';
import { BehaviorSubject } from 'rxjs';
import { DistributorRepository } from '../repository/distributor.repository';
import { OrderRepository } from '../repository/order.repository';
import { RequestsRepository } from '../repository/requests.repository';
import { DriverRepository } from '../repository/driver.repository';
import { Order } from '../schema/order.schema';
import { Cron, CronExpression } from '@nestjs/schedule';
import { FilterQuery } from 'mongoose';

type AdvancedOrder = Order & { operation: 'addition' | 'removal' };
type AdvancedOrderUpdate = { id: string; operation: 'addition' | 'removal' };

@Injectable()
export class SSEService implements OnModuleInit {
  @Inject(ConfigService)
  public config: ConfigService;

  private currentRetailer = new BehaviorSubject({});
  private currentDriver = new BehaviorSubject({});
  private currentAdmin = new BehaviorSubject({});
  private currentAdminRequests = new BehaviorSubject({});
  private currentDistributor = new BehaviorSubject({});
  private currentOrder = new BehaviorSubject<AdvancedOrder[]>([]);
  private currentDeliveredOrder = new BehaviorSubject<AdvancedOrderUpdate[]>(
    [],
  );
  private currentProcessedOrder = new BehaviorSubject<AdvancedOrderUpdate[]>(
    [],
  );
  private currentDriverVerification = new BehaviorSubject([]);
  private currentOrderStatus = new BehaviorSubject([]);

  constructor(
    private readonly retailerRepository: RetailerRepository,
    private readonly distributorRepository: DistributorRepository,
    private readonly orderRepository: OrderRepository,
    private readonly requestsRepository: RequestsRepository,
    private readonly driverRepository: DriverRepository,
  ) {}

  onModuleInit() {
    this.watchRetailer();
    this.watchDistributor();
    this.watchDriver();
    this.watchOrders();
    this.watchRequests();
  }

  getCurrentRetailer() {
    return this.currentRetailer;
  }

  getCurrentDeliveredOrder() {
    return this.currentDeliveredOrder;
  }

  getCurrentProcessedOrder() {
    return this.currentProcessedOrder;
  }

  async watchRetailer() {
    try {
      const changeStream = this.retailerRepository.watchForNewRecords();
      changeStream.on('change', (updates: MongoWatchResponse<Retailer>) => {
        if (updates.operationType == 'insert') {
          this.emitEvent(NEW_RETAILER_EVENT_NAME, updates.fullDocument);
        }
      });
    } catch (err) {
      console.error(err);
    }
  }

  async watchDriver() {
    try {
      const changeStream = this.driverRepository.watchForNewRecords();
      changeStream.on('change', (updates: MongoWatchResponse<Retailer>) => {
        if (updates.operationType == 'insert') {
          this.emitEvent(NEW_DRIVER_EVENT_NAME, updates.fullDocument);
        } else if (
          updates.operationType == 'update' &&
          updates.updateDescription.updatedFields.verified
        ) {
          this.emitEvent(
            DRIVER_VERIFICATION_EVENT_NAME,
            updates.documentKey._id.toString(),
          );
        }
      });
    } catch (err) {
      console.error(err);
    }
  }

  async watchRequests() {
    try {
      const changeStream = this.requestsRepository.watchForNewRecords();
      changeStream.on('change', (updates: MongoWatchResponse<Retailer>) => {
        if (updates.operationType == 'insert') {
          this.emitEvent(NEW_ADMIN_REQUESTS_EVENT_NAME, updates.fullDocument);
        }
      });
    } catch (err) {
      console.error(err);
    }
  }

  async watchOrders() {
    try {
      const changeStream = this.orderRepository.watchForNewRecords();
      changeStream.on(
        'change',
        (updates: MongoWatchResponse<AdvancedOrder>) => {
          if (updates.operationType == 'insert') {
            this.emitEvent(NEW_ORDER_EVENT_NAME, {
              order: updates.fullDocument,
              operation: 'addition',
            });
          } else if (
            updates.operationType == 'update' &&
            this.orderStatusChanged(
              updates.updateDescription.updatedFields.status,
            )
          ) {
            // Processed Order
            if (
              updates.updateDescription.updatedFields.status ===
              'HEADING_TO_PICKUP'
            ) {
              this.emitEvent(NEW_PROCESSED_ORDER_EVENT_NAME, {
                id: updates.documentKey._id.toString(),
                operation: 'addition',
              });

              setTimeout(() => {
                this.emitEvent(NEW_ORDER_EVENT_NAME, {
                  id: updates.documentKey._id.toString(),
                  operation: 'removal',
                });
              }, 4000);
            }

            // New Delivered Order
            if (
              updates.updateDescription.updatedFields.status ===
              'ORDER_DELIVERED'
            ) {
              this.emitEvent(NEW_DELIVERED_ORDER_EVENT_NAME, {
                id: updates.documentKey._id.toString(),
                operation: 'addition',
              });

              setTimeout(() => {
                this.emitEvent(NEW_PROCESSED_ORDER_EVENT_NAME, {
                  id: updates.documentKey._id.toString(),
                  operation: 'removal',
                });
              }, 4000);
            }

            //Retailer app order tracking
            this.emitEvent(ORDER_STATUS_CHANGE_EVENT_NAME, {
              id: updates.documentKey._id.toString(),
              status: updates.updateDescription.updatedFields.status,
            });
          }
        },
      );
    } catch (err) {
      console.error(err);
    }
  }

  orderStatusChanged(newStatus: string): boolean {
    if (newStatus === 'HEADING_TO_PICKUP') return true;
    if (newStatus === 'HEADING_TO_DROPOFF') return true;
    if (newStatus === 'ORDER_DELIVERED') return true;

    return false;
  }

  async watchDistributor() {
    try {
      const changeStream = this.distributorRepository.watchForNewRecords();
      changeStream.on('change', (updates: MongoWatchResponse<Retailer>) => {
        if (updates.operationType === 'insert') {
          this.emitEvent(NEW_DISTRIBUTOR_EVENT_NAME, updates.fullDocument);
        }
      });
    } catch (err) {
      console.error(err);
    }
  }

  emitEvent<T>(eventName: string, data: T) {
    switch (eventName) {
      case NEW_RETAILER_EVENT_NAME:
        this.currentRetailer.next(data);
        break;
      case NEW_DRIVER_EVENT_NAME:
        this.currentDriver.next(data);
        break;
      case NEW_ADMIN_EVENT_NAME:
        this.currentAdmin.next(data);
        break;
      case NEW_DISTRIBUTOR_EVENT_NAME:
        this.currentDistributor.next(data);
        break;
      case NEW_ADMIN_REQUESTS_EVENT_NAME:
        this.currentAdminRequests.next(data);
        break;
      case NEW_ORDER_EVENT_NAME:
        this.currentOrder.next([
          ...this.currentOrder.value,
          data as AdvancedOrder,
        ]);
        break;
      case NEW_DELIVERED_ORDER_EVENT_NAME:
        this.currentDeliveredOrder.next([
          ...this.currentDeliveredOrder.value,
          data as AdvancedOrderUpdate,
        ]);
        break;
      case NEW_PROCESSED_ORDER_EVENT_NAME:
        this.currentProcessedOrder.next([
          ...this.currentProcessedOrder.value,
          data as AdvancedOrderUpdate,
        ]);
        break;
      case DRIVER_VERIFICATION_EVENT_NAME:
        this.currentDriverVerification.next([
          ...this.currentDriverVerification.value,
          data,
        ]);
        break;
      case ORDER_STATUS_CHANGE_EVENT_NAME:
        this.currentOrderStatus.next([...this.currentOrderStatus.value, data]);
        break;
    }
  }

  getCurrentDriver() {
    return this.currentDriver;
  }
  getCurrentDriverVerification() {
    return this.currentDriverVerification;
  }
  getCurrentAdmin() {
    return this.currentAdmin;
  }
  getCurrentAdminRequest() {
    return this.currentAdminRequests;
  }
  getCurrentDistributor() {
    return this.currentDistributor;
  }
  getCurrentOrder() {
    return this.currentOrder;
  }
  getCurrentOrderStatusChange() {
    return this.currentOrderStatus;
  }
  clearNewOrder() {
    this.currentOrder.next([]);
  }
  clearOrderStatus() {
    this.currentOrderStatus.next([]);
  }
  clearDriverVerification() {
    this.currentDriverVerification.next([]);
  }

  getDateDiffInMinutes = (relative: Date) => {
    const diff = Math.abs(relative.getTime() - new Date().getTime());
    return Math.floor(diff / 1000 / 60);
  };

  async getOrder(filterQuery?: FilterQuery<Order>, skip = 0, limit = 10) {
    try {
      return this.orderRepository.find(filterQuery, skip, limit);
    } catch (err) {
      throw err;
    }
  }

  /**
   * Clear data every 1AM
   */
  @Cron(CronExpression.EVERY_DAY_AT_1AM)
  async clearOrderEventLog() {
    this.clearNewOrder();
    this.clearOrderStatus();
    this.clearDriverVerification();
  }

  removeDuplicates = (orders: Order[]) =>
    orders.reduce((accumulator: Order[], current) => {
      if (!accumulator.find((item) => item['_id'] === current['_id'])) {
        accumulator.push(current);
      }

      return accumulator;
    }, []);
}
