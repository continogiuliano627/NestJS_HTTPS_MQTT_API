import {Module} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import {Device} from 'src/database/entities/device.entity';
import {DeviceController} from './device.controller';
import {DeviceService} from './device.service';

@Module({
	imports: [TypeOrmModule.forFeature([Device])],
	providers: [DeviceService],
	controllers: [DeviceController]
})
export class DeviceModule {}
