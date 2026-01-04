import {Module} from '@nestjs/common';
import {ConfigModule} from '@nestjs/config';
import {AppController} from './app.controller';
import {AppService} from './app.service';
import {DatabaseModule} from './database/database.module';
import {TempSensorModule} from './temp-sensor/temp-sensor.module';
import {UserModule} from './user/user.module';
import { DeviceService } from './device/device.service';
import { DeviceController } from './device/device.controller';
import { DeviceModule } from './device/device.module';

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
			envFilePath: '.env'
		}),
		DatabaseModule,
		TempSensorModule,
		UserModule,
		DeviceModule
	],
	controllers: [AppController, DeviceController],
	providers: [AppService, DeviceService]
})
export class AppModule {}
