import {Module} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import {DeviceActionLog} from 'src/database/entities/dal.entity';
import {Device_Module} from 'src/database/entities/device-module.entity';
import {Device} from 'src/database/entities/device.entity';
import {MqttModule} from 'src/mqtt/mqtt.module';
import {DeviceEventController} from './DeviceEvent.controller';
import {DeviceEventService} from './DeviceEvent.service';

@Module({
	imports: [TypeOrmModule.forFeature([Device, Device_Module, DeviceActionLog]), MqttModule],
	providers: [DeviceEventService],
	controllers: [DeviceEventController]
})
export class DeviceEventModule {}
