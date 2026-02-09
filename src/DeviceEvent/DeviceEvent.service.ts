import {
	BadRequestException,
	Injectable,
	InternalServerErrorException,
	OnModuleInit
} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {DeviceActionLog} from 'src/database/entities/dal.entity';
import {Device_Module} from 'src/database/entities/device-module.entity';
import {Device} from 'src/database/entities/device.entity';
import {DeviceActionStatus} from 'src/device_action_log/dal.dto';
import {MatchesMAC} from 'src/global/functions';
import {mqttResp} from 'src/mqtt/mqtt.dto';
import {MqttService} from 'src/mqtt/mqtt.service';
import {Repository} from 'typeorm';

@Injectable()
export class DeviceEventService implements OnModuleInit {
	constructor(
		private readonly mqttService: MqttService,
		@InjectRepository(Device)
		private readonly DeviceRepo: Repository<Device>,
		@InjectRepository(Device_Module)
		private readonly DeviceModuleRepo: Repository<Device_Module>,
		@InjectRepository(DeviceActionLog)
		private readonly DeviceActionRepo: Repository<DeviceActionLog>
	) {}
	onModuleInit() {
		this.mqttService.addHandler((topic, payload) => {
			void this.handleMessage(topic, payload).catch((err) => {
				console.error('DeviceEventService error: ', err);
			});
		});
	}

	private async handleMessage(_topic: string, payload: Buffer) {
		const raw = payload.toString('utf8');
		let parsed: unknown;

		try {
			parsed = JSON.parse(raw);
		} catch (error) {
			throw new InternalServerErrorException(
				`Error to parse mqtt message: ${JSON.stringify(error)}`
			);
		}
		if (
			typeof parsed === 'object' &&
			parsed !== null &&
			'id' in parsed &&
			'action' in parsed &&
			'pin' in parsed
		) {
			const msg = parsed as mqttResp;
			if (msg.action !== 'update') {
				return;
			}
			const targetDevice = await this.DeviceRepo.findOneBy({id: msg.id});
			if (!targetDevice) return;
			//recibido mensaje de un dispositivo quizas aun no registrado
			const targetModule = await this.DeviceModuleRepo.findOneBy({
				deviceId: msg.id,
				pin: msg.pin
			});
			if (!targetModule) return;
			//modulo quizas aun no registrado
			const now = new Date();
			try {
				await this.DeviceActionRepo.save({
					action: 'read',
					deviceId: targetDevice.id,
					pin: msg.pin,
					requestedAt: now,
					respondedAt: now,
					requestedValue: 'autoread',
					errorMessage: null,
					status: DeviceActionStatus.ACK,
					responseValue: JSON.stringify(msg.value)
				});
			} catch (error) {
				throw new InternalServerErrorException(
					`Error saving device event: ${JSON.stringify(error)}`
				);
			}

			//parsear para websocket
			//emitir websocket
		} else console.error('interceptor payload: ', payload);
	}

	async deleteLogBetween(start: string, finish: string): Promise<boolean> {
		if (!start || !finish) throw new BadRequestException(`Error delete between: Missing params`);
		console.log(`Parameters: "${start}"\\"${finish}"`);
		const startDate = start.length ? new Date(start) : new Date(1997);
		const finishDate = finish.length ? new Date(finish) : new Date(2099);
		console.log(`Dates: "${startDate.toISOString()}"\\"${finishDate.toISOString()}"`);
		if (startDate > finishDate)
			throw new BadRequestException(`Error deleten between: Invalid date range`);
		const result = await this.DeviceActionRepo.createQueryBuilder()
			.delete()
			.from(DeviceActionLog)
			.where('requestedAt >= :start', {start: startDate})
			.andWhere('requestedAt <= :end', {end: finishDate})
			.execute();
		return result.affected !== 0;
	}

	async getByDevice(id: string): Promise<DeviceActionLog[]> {
		if (!MatchesMAC(id))
			throw new BadRequestException(`Error get Device event by device: bad id received`);

		const elements = await this.DeviceActionRepo.find({
			where: {
				Device: {id}
			},
			relations: ['device'],
			order: {
				requestedAt: 'DESC'
			}
		});

		return elements;
	}
}
