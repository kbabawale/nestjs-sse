import { Controller, Get, Res } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Response } from 'express';

import {
  DRIVER_VERIFICATION_EVENT_NAME,
  NEW_ADMIN_REQUESTS_EVENT_NAME,
  NEW_DELIVERED_ORDER_EVENT_NAME,
  NEW_DISTRIBUTOR_EVENT_NAME,
  NEW_DRIVER_EVENT_NAME,
  NEW_ORDER_EVENT_NAME,
  NEW_PROCESSED_ORDER_EVENT_NAME,
  NEW_RETAILER_EVENT_NAME,
  ORDER_STATUS_CHANGE_EVENT_NAME,
} from '../model/sse.model';
import { SSEService } from '../service/sse.service';

@Controller('')
export class SSEController {
  constructor(private readonly SSEService: SSEService) {}

  @ApiTags('Server Events')
  @Get('new-retailer')
  sseR(@Res() res: Response) {
    const headers = {
      'Content-Type': 'text/event-stream',
      Connection: 'keep-alive',
      'Cache-Control': 'no-cache',
      'X-Accel-Buffering': 'no',
    };
    res.writeHead(200, headers).flushHeaders();

    this.SSEService.getCurrentRetailer().subscribe((resp) => {
      res.write(`event: ${NEW_RETAILER_EVENT_NAME}\n`);
      res.write(`data: ${JSON.stringify(resp)}\n`);
      res.write('\n\n');
    });
  }

  @ApiTags('Server Events')
  @Get('new-driver')
  sseD(@Res() res: Response) {
    const headers = {
      'Content-Type': 'text/event-stream',
      Connection: 'keep-alive',
      'Cache-Control': 'no-cache',
      'X-Accel-Buffering': 'no',
    };
    res.writeHead(200, headers).flushHeaders();

    this.SSEService.getCurrentDriver().subscribe((resp) => {
      res.write(`event: ${NEW_DRIVER_EVENT_NAME}\n`);
      res.write(`data: ${JSON.stringify(resp)}\n`);
      res.write('\n\n');
    });
  }

  @ApiTags('Server Events')
  @Get('new-driver-verification')
  verifyDriverEvent(@Res() res: Response) {
    const headers = {
      'Content-Type': 'text/event-stream',
      Connection: 'keep-alive',
      'Cache-Control': 'no-cache',
      'X-Accel-Buffering': 'no',
    };
    res.writeHead(200, headers).flushHeaders();

    this.SSEService.getCurrentDriverVerification().subscribe((resp) => {
      res.write(`event: ${DRIVER_VERIFICATION_EVENT_NAME}\n`);
      res.write(`data: ${JSON.stringify(resp)}\n`);
      res.write('\n\n');
    });
  }

  @ApiTags('Server Events')
  @Get('new-admin-request')
  getNewRequest(@Res() res: Response) {
    const headers = {
      'Content-Type': 'text/event-stream',
      Connection: 'keep-alive',
      'Cache-Control': 'no-cache',
      'X-Accel-Buffering': 'no',
    };
    res.writeHead(200, headers).flushHeaders();

    this.SSEService.getCurrentAdminRequest().subscribe((resp) => {
      res.write(`event: ${NEW_ADMIN_REQUESTS_EVENT_NAME}\n`);
      res.write(`data: ${JSON.stringify(resp)}\n`);
      res.write('\n\n');
    });
  }

  @ApiTags('Server Events')
  @Get('new-distributor')
  sseDis(@Res() res: Response) {
    const headers = {
      'Content-Type': 'text/event-stream',
      Connection: 'keep-alive',
      'Cache-Control': 'no-cache',
      'X-Accel-Buffering': 'no',
    };
    res.writeHead(200, headers).flushHeaders();

    this.SSEService.getCurrentDistributor().subscribe((resp) => {
      res.write(`event: ${NEW_DISTRIBUTOR_EVENT_NAME}\n`);
      res.write(`data: ${JSON.stringify(resp)}\n`);
      res.write('\n\n');
    });
  }

  @ApiTags('Server Events')
  @Get('new-order')
  newOrderSSE(@Res() res: Response) {
    const headers = {
      'Content-Type': 'text/event-stream',
      Connection: 'keep-alive',
      'Cache-Control': 'no-cache',
      'X-Accel-Buffering': 'no',
    };
    res.writeHead(200, headers).flushHeaders();

    this.SSEService.getCurrentOrder().subscribe((resp) => {
      res.write(`event: ${NEW_ORDER_EVENT_NAME}\n`);
      res.write(`data: ${JSON.stringify(resp)}\n`);
      res.write('\n\n');
    });
  }

  @ApiTags('Server Events')
  @Get('new-delivered-order')
  newDeliveredOrderSSE(@Res() res: Response) {
    const headers = {
      'Content-Type': 'text/event-stream',
      Connection: 'keep-alive',
      'Cache-Control': 'no-cache',
      'X-Accel-Buffering': 'no',
    };
    res.writeHead(200, headers).flushHeaders();

    this.SSEService.getCurrentDeliveredOrder().subscribe((resp) => {
      res.write(`event: ${NEW_DELIVERED_ORDER_EVENT_NAME}\n`);
      res.write(`data: ${JSON.stringify(resp)}\n`);
      res.write('\n\n');
    });
  }

  @ApiTags('Server Events')
  @Get('new-processed-order')
  newProcessedOrderSSE(@Res() res: Response) {
    const headers = {
      'Content-Type': 'text/event-stream',
      Connection: 'keep-alive',
      'Cache-Control': 'no-cache',
      'X-Accel-Buffering': 'no',
    };
    res.writeHead(200, headers).flushHeaders();

    this.SSEService.getCurrentProcessedOrder().subscribe((resp) => {
      res.write(`event: ${NEW_PROCESSED_ORDER_EVENT_NAME}\n`);
      res.write(`data: ${JSON.stringify(resp)}\n`);
      res.write('\n\n');
    });
  }

  @ApiTags('Server Events')
  @Get('track-order-status')
  trackOrderSSE(@Res() res: Response) {
    const headers = {
      'Content-Type': 'text/event-stream',
      Connection: 'keep-alive',
      'Cache-Control': 'no-cache',
      'X-Accel-Buffering': 'no',
    };
    res.writeHead(200, headers).flushHeaders();

    this.SSEService.getCurrentOrderStatusChange().subscribe((resp) => {
      res.write(`event: ${ORDER_STATUS_CHANGE_EVENT_NAME}\n`);
      res.write(`data: ${JSON.stringify(resp)}\n`);
      res.write('\n\n');
    });
  }
}
