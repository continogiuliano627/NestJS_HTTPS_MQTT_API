import {Module} from '@nestjs/common';
import {MqttController} from './mqtt.controller';
import {MqttService} from './mqtt.service';

//@Global()
@Module({
	providers: [MqttService],
	exports: [MqttService],
	controllers: [MqttController]
})
export class MqttModule {}
