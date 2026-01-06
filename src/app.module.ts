import {Module} from '@nestjs/common';
import {ConfigModule} from '@nestjs/config';
import {AppController} from './app.controller';
import {AppService} from './app.service';
import {DatabaseModule} from './database/database.module';
import {DeviceModule} from './device/device.module';
import {MqttModule} from './mqtt/mqtt.module';
import {TempSensorModule} from './temp-sensor/temp-sensor.module';
import {UserModule} from './user/user.module';

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
			envFilePath: '.env'
		}),
		DatabaseModule,
		TempSensorModule,
		UserModule,
		DeviceModule,
		MqttModule
	],
	controllers: [AppController],
	providers: [AppService]
})
export class AppModule {}
