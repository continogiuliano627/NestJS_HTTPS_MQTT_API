import {Module} from '@nestjs/common';
import {AppController} from './app.controller';
import {AppService} from './app.service';
import {DatabaseModule} from './database/database.module';
import {TempSensorModule} from './temp-sensor/temp-sensor.module';

@Module({
	imports: [DatabaseModule, TempSensorModule],
	controllers: [AppController],
	providers: [AppService]
})
export class AppModule {}
