import {Module} from '@nestjs/common';
import {AppController} from './app.controller';
import {AppService} from './app.service';
import {DatabaseModule} from './database/database.module';
import {TempSensorModule} from './temp-sensor/temp-sensor.module';
import { UserModule } from './user/user.module';

@Module({
	imports: [DatabaseModule, TempSensorModule, UserModule],
	controllers: [AppController],
	providers: [AppService]
})
export class AppModule {}
