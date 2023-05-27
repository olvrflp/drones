import { RedisModule } from '@liaoliaots/nestjs-redis';
import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DroneController } from './controllers/Drone.controller';
import { BatteryMonitor } from './services/BatteryMonitor.service';
import { DroneService } from './services/Drone.service';

@Module({
  imports: [
    RedisModule.forRoot({ config: { url: process.env.REDIS_URL } }),
    ScheduleModule.forRoot()
  ],
  controllers: [AppController, DroneController],
  providers: [AppService, DroneService, BatteryMonitor],
})
export class AppModule {}
