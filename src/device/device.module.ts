import {Module} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import {Device_Module} from 'src/database/entities/device-module.entity';
import {Device} from 'src/database/entities/device.entity';
import {MqttModule} from 'src/mqtt/mqtt.module';
import {DeviceController} from './device.controller';
import {DeviceService} from './device.service';

@Module({
	imports: [TypeOrmModule.forFeature([Device, Device_Module]), MqttModule],
	providers: [DeviceService],
	controllers: [DeviceController]
})
export class DeviceModule {}
