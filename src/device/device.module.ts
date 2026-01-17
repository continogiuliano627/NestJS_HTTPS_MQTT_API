import {Module} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import {Device} from 'src/database/entities/device.entity';
import {MqttModule} from 'src/mqtt/mqtt.module';
import {DeviceController} from './device.controller';
import {DeviceService} from './device.service';

@Module({
	imports: [TypeOrmModule.forFeature([Device]), MqttModule],
	providers: [DeviceService],
	controllers: [DeviceController]
})
export class DeviceModule {}
