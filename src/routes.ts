import { Routes } from '@nestjs/core';
import { SSEModule } from './sse/sse.module';

export const routes: Routes = [
  {
    path: 'api/v1/sse',
    module: SSEModule,
  },
];
