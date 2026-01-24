import {Body, Controller, Post} from '@nestjs/common';
import {ApiBody} from '@nestjs/swagger';
import {MqttMessageExample, mqttSetMsg} from './mqtt.dto';
import {MqttService} from './mqtt.service';
@Controller('mqtt_message')
export class MqttController {
	constructor(private readonly service: MqttService) {}

	@Post('set')
	@ApiBody({
		required: true,
		examples: {
			1: {
				value: {...MqttMessageExample, action: 'set'}
			}
		}
	})
	setPin(@Body() data: mqttSetMsg) {
		return this.service.publishWithAck(process.env.MQTT_DEFAULT_TOPIC || '', data, 5000);
	}
}
