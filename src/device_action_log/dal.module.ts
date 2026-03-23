import {Module} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import {Device} from 'src/database/entities/device.entity';
import {DeviceActionLog} from '../database/entities/dal.entity';
import {DeviceActionLogController} from './dal.controller';
import {DeviceActionLogService} from './dal.service';

@Module({
	imports: [TypeOrmModule.forFeature([Device, DeviceActionLog])],
	providers: [DeviceActionLogService],
	controllers: [DeviceActionLogController]
})
export class DeviceActionLogModule {}
