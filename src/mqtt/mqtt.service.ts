import {Injectable, OnModuleDestroy, OnModuleInit} from '@nestjs/common';
import * as mqtt from 'mqtt';
import {MqttMessageHandler} from './mqtt.dto';

@Injectable()
export class MqttService implements OnModuleInit, OnModuleDestroy {
	private client: mqtt.MqttClient;
	private handlers = new Set<MqttMessageHandler>();

	onModuleInit() {
		this.client = mqtt.connect(process.env.MQTT_URL!, {
			username: process.env.MQTT_USERNAME,
			password: process.env.MQTT_PASSWORD,
			clientId: process.env.MQTT_CLIENT_ID,
			clean: true,
			reconnectPeriod: 3000
		});

		this.client.on('connect', () => {
			const topic = process.env.MQTT_DEFAULT_TOPIC!;
			this.client.subscribe(topic, {qos: 1});
		});

		this.client.on('message', (topic, payload) => {
			for (const handler of this.handlers) {
				handler(topic, payload);
			}
		});

		this.client.on('error', (err) => {
			console.log(`Error intercepted: '${JSON.stringify(err)}'`);
		});
	}

	publish(topic: string, message: string | Buffer) {
		this.client.publish(topic, message, {qos: 1});
	}

	addHandler(handler: MqttMessageHandler) {
		this.handlers.add(handler);
	}
	removeHandler(handler: MqttMessageHandler) {
		this.handlers.delete(handler);
	}

	onModuleDestroy() {
		this.client?.end(true);
	}
}
