import {Module} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import {Device_Module} from 'src/database/entities/device-module.entity';
import {Device} from 'src/database/entities/device.entity';
import {ModuleType} from 'src/database/entities/module-type.entity';
import {DeviceModuleController} from './device-module.controller';
import {DeviceModuleService} from './device-module.service';

@Module({
	imports: [TypeOrmModule.forFeature([Device_Module, Device, ModuleType])],
	providers: [DeviceModuleService],
	controllers: [DeviceModuleController]
})
export class DeviceModuleModule {}
