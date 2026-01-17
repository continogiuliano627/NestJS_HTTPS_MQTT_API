import {Module} from '@nestjs/common';
import {ConfigModule} from '@nestjs/config';
import {AppController} from './app.controller';
import {AppService} from './app.service';
import {DatabaseModule} from './database/database.module';
import {DeviceModule} from './device/device.module';
import {ErrorLogsModule} from './error_logs/error_log.module';
import {ModuleTypeController} from './module-type/module-type.controller';
import {ModuleTypeModule} from './module-type/module-type.module';
import {ModuleTypeService} from './module-type/module-type.service';
import {MqttModule} from './mqtt/mqtt.module';
import {UserModule} from './user/user.module';

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
			envFilePath: '.env'
		}),
		DatabaseModule,
		UserModule,
		DeviceModule,
		MqttModule,
		ErrorLogsModule,
		ModuleTypeModule
	],
	controllers: [AppController, ModuleTypeController],
	providers: [AppService, ModuleTypeService]
})
export class AppModule {}
