import {Injectable, OnModuleDestroy, OnModuleInit} from '@nestjs/common';
import * as mqtt from 'mqtt';

@Injectable()
export class MqttService implements OnModuleInit, OnModuleDestroy {
	private client: mqtt.MqttClient;

	onModuleInit() {
		this.client = mqtt.connect(process.env.MQTT_URL!, {
			username: process.env.MQTT_USERNAME,
			password: process.env.MQTT_PASSWORD,
			clientId: process.env.MQTT_CLIENT_ID,
			clean: true,
			reconnectPeriod: 3000
		});

		this.client.on('connect', () => {
			console.log('MQTT conectado');
			console.log(`Suscribiendo a topic '${process.env.MQTT_DEFAULT_TOPIC}'`);
			this.client.subscribe(process.env.MQTT_DEFAULT_TOPIC as string, {qos: 1});
		});

		this.client.on('message', (topic, payload) => {
			const msg = payload.toString();
			console.log(`Topic: '${topic}'\nMsg: '${msg}'`);
		});

		this.client.on('error', (err) => {
			console.log(`Error intercepted: '${JSON.stringify(err)}'`);
		});
	}

	publish(topic: string, message: string | Buffer) {
		this.client.publish(topic, message, {qos: 1});
	}

	onModuleDestroy() {
		this.client?.end(true);
	}
}
