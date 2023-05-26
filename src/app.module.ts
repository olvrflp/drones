import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DroneController } from './controllers/Drone.controller';

@Module({
  imports: [],
  controllers: [AppController, DroneController],
  providers: [AppService],
})
export class AppModule {}
