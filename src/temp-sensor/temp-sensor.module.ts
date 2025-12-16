import {Module} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import {TempSensor} from 'src/database/entities/temp-sensor.entity';
import {TempSensorController} from './temp-sensor.controller';
import {TempSensorService} from './temp-sensor.service';

@Module({
	imports: [TypeOrmModule.forFeature([TempSensor])],
	providers: [TempSensorService],
	controllers: [TempSensorController]
})
export class TempSensorModule {}
