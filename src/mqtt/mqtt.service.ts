import {
	BadRequestException,
	Injectable,
	OnModuleDestroy,
	OnModuleInit,
	RequestTimeoutException
} from '@nestjs/common';
import * as mqtt from 'mqtt';
import {MqttMessageHandler, mqttResp, PendingKey, PendingRequest} from './mqtt.dto';

@Injectable()
export class MqttService implements OnModuleInit, OnModuleDestroy {
	private client: mqtt.MqttClient;
	private handlers = new Set<MqttMessageHandler>();
	private pending = new Map<PendingKey, PendingRequest>();

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
			const raw = payload.toString('utf8');
			let parsed: unknown;
			try {
				parsed = JSON.parse(raw);
			} catch {
				return;
			}
			if (
				typeof parsed === 'object' &&
				parsed !== null &&
				'id' in parsed &&
				'action' in parsed &&
				'pin' in parsed
			) {
				const msg = parsed as mqttResp;

				if (msg.action !== 'update') return;
				const key = `${msg.id}:${msg.pin}`;
				const pending = this.pending.get(key);

				if (pending) {
					clearTimeout(pending.timeout);
					pending.resolve(msg.value ?? '');
					this.pending.delete(key);
					return;
				}
			}

			for (const handler of this.handlers) {
				handler(topic, payload);
			}
		});

		this.client.on('error', (err) => {
			console.error(`Error intercepted: '${JSON.stringify(err)}'`);
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

	async publishWithAck(
		topic: string,
		message: {id: string; pin: string; action: 'read' | 'set'} & Record<string, unknown>,
		timeoutMs = 5000
	): Promise<string> {
		if (message.id === 'device_report') {
			this.client.publish(topic, JSON.stringify(message), {qos: 1});
			return '';
		}
		if (message.action !== 'read' && message.action !== 'set')
			throw new BadRequestException(
				`Error send mqtt message: invalid action '${JSON.stringify(message.action)}'`
			);
		const key = `${message.id}:${message.pin}`;
		if (this.pending.has(key)) throw new Error(`Pending request already exists for ${key}`);

		return new Promise<string>((resolve, reject) => {
			const timeout = setTimeout(() => {
				this.pending.delete(key);
				reject(new RequestTimeoutException(`ACK timeout for ${key}`));
			}, timeoutMs);

			this.pending.set(key, {resolve, reject, timeout});

			this.client.publish(topic, JSON.stringify(message), {qos: 1});
		});
	}
}
