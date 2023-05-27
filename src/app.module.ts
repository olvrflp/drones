import { RedisModule } from '@liaoliaots/nestjs-redis';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DroneController } from './controllers/Drone.controller';
import { DroneService } from './services/Drone.service';

@Module({
  imports: [RedisModule.forRoot({ config: { url: process.env.REDIS_URL } })],
  controllers: [AppController, DroneController],
  providers: [AppService, DroneService],
})
export class AppModule {}
