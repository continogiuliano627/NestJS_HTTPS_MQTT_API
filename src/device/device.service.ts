import {
	BadRequestException,
	ConflictException,
	Injectable,
	InternalServerErrorException,
	NotFoundException
} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Device_Module} from 'src/database/entities/device-module.entity';
import {Device} from 'src/database/entities/device.entity';
import {deepEqual, MacAddressRegex, MatchesMAC, PlainObject} from 'src/global/functions';
import {MqttService} from 'src/mqtt/mqtt.service';
import {Repository} from 'typeorm';
import {DeviceDeleteDTO, DeviceSendActionDTO, DeviceUpdateDTO} from './device.dto';
import {DeviceMqttResponseDTO, parseMqttMessage} from './device.utils';

@Injectable()
export class DeviceService {
	constructor(
		@InjectRepository(Device) private repository: Repository<Device>,
		@InjectRepository(Device_Module) private DeviceRepo: Repository<Device_Module>,
		private mqttService: MqttService
	) {}

	async createOne(name: string, id: string, pins: string[] | null): Promise<Device> {
		if (!name || name.length < 3)
			throw new BadRequestException('Error creating device: invalid name received');
		if (!id || !MacAddressRegex.test(id))
			throw new BadRequestException(`Error creating device: Bad id received`);
		const existsName = await this.repository.findOneBy({
			name
		});
		if (existsName) {
			if (!existsName.isDeleted)
				throw new ConflictException('Error creating device: Device with this name already exists');
			else throw new ConflictException('Error creating device: Device must be restored');
		}
		const existsId = await this.repository.findOneBy({id});
		if (existsId) {
			if (!existsId.isDeleted)
				throw new ConflictException('Error creating device: Device with this id already exists');
			else throw new ConflictException('Error creating device: Device must be restored');
		}
		try {
			await this.repository.save({id, name, pins: pins?.length ? pins : null});
		} catch (error) {
			throw new InternalServerErrorException(`Error creating device: ${JSON.stringify(error)}`);
		}
		const created = await this.repository.findOneBy({name});
		if (!created)
			throw new InternalServerErrorException(`Error creating device: created but not found`);
		return created;
	}

	async updateOne(data: DeviceUpdateDTO): Promise<Device> {
		if (!data) throw new BadRequestException('Error updating device: no data received');
		if (!data.id || !MatchesMAC(data.id))
			throw new BadRequestException('Error updating device: invalid mac received');
		const target = await this.repository.findOneBy({id: data.id});
		//verificamos que exista y si isDeleted es true debe cambiar, no se puede cambiar un eliminado salvo se restaure
		if (!target) throw new ConflictException('Error updating device: target device doesnt exists');
		if (target.isDeleted)
			throw new BadRequestException(
				`Error updating device: cant update deleted device, only restore`
			);
		//validamos que exista algun dato a cambiar
		if (!data.name && !data.pins)
			throw new BadRequestException('Error updating device: no data to change.');
		let changeReceived: boolean = false;
		if (data.name && data.name !== target.name) changeReceived = true;

		if (
			data.pins &&
			!deepEqual(data.pins as unknown as PlainObject, target.pins as unknown as PlainObject)
		)
			changeReceived = true;

		if (!changeReceived)
			throw new BadRequestException('Error updating device: received data is the same as old.');
		try {
			await this.repository.save({
				id: data.id,
				name: data.name || target.name,
				pins: data.pins || target.pins,
				isDeleted: typeof data.isDeleted === 'boolean' ? data.isDeleted : target.isDeleted
			});
		} catch (error) {
			throw new InternalServerErrorException(`Error updating device: ${JSON.stringify(error)}`);
		}
		const updated = await this.repository.findOneBy({id: data.id});
		if (!updated)
			throw new ConflictException('Error updating device: device not found after update');
		target.updatedAt = updated.updatedAt;
		if (deepEqual(target as unknown as PlainObject, updated as unknown as PlainObject))
			throw new InternalServerErrorException('Error updating device: device wasnt updated');
		return updated;
	}

	async findById(id: string): Promise<Device> {
		if (!id || !MatchesMAC(id))
			throw new BadRequestException('Error find device by ID: bad id received');
		const found = await this.repository.findOneBy({id});
		if (!found) throw new NotFoundException('Error find device by ID: element not found');
		return found;
	}

	async findByName(name: string): Promise<Device> {
		if (!name || name.length < 3)
			throw new BadRequestException('Error find device by name: bad name received');
		const found = await this.repository.findOneBy({name});
		if (!found) throw new NotFoundException('Error find device by name: element not found');
		return found;
	}

	async findAll(): Promise<Device[]> {
		return await this.repository.findBy({isDeleted: false});
	}

	async findDeleted(): Promise<Device[]> {
		return await this.repository.findBy({isDeleted: true});
	}

	async restoreDeleted(id: string): Promise<Device> {
		if (!MatchesMAC(id))
			throw new BadRequestException('Error restore device: ID provided is not MAC');
		const target = await this.repository.findOneBy({id});
		if (!target) throw new NotFoundException('Error restore device: target error not found');
		if (!target.isDeleted) throw new ConflictException('Error restore device: device not deleted');
		try {
			await this.repository.save({...target, isDeleted: false});
		} catch (error) {
			throw new InternalServerErrorException(`Error restore device: ${JSON.stringify(error)}`);
		}
		const restored = await this.repository.findOneBy({id});
		if (!restored)
			throw new InternalServerErrorException('Error restore device: restored but not found');
		if (restored.isDeleted)
			throw new InternalServerErrorException('Error restore device: device wasnt restored');
		return restored;
	}

	async deleteOne(data: DeviceDeleteDTO): Promise<boolean> {
		if (!data || !data.id || !MatchesMAC(data.id))
			throw new BadRequestException('Error delete device: bad id received');
		const found = await this.repository.findOneBy({id: data.id});
		if (!found) throw new NotFoundException('Error delete device: element not found');
		if (data.force) {
			try {
				await this.repository.delete({id: data.id});
			} catch (error) {
				throw new InternalServerErrorException(`Error delete device: ${JSON.stringify(error)}`);
			}
			const existing = await this.repository.findOneBy({id: data.id});
			if (existing !== null)
				throw new InternalServerErrorException('Error delete device: device wasnt deleted');
			return true;
		}
		try {
			await this.repository.save({
				id: data.id,
				isDeleted: true
			});
		} catch (error) {
			throw new InternalServerErrorException('Error delete device: device wasnt deleted');
		}
		const deleted = await this.repository.findOneBy({id: data.id});
		if (!deleted || !deleted.isDeleted)
			throw new InternalServerErrorException('Error delete service: device wasnt deleted');
		return true;
	}

	async getConnectedMqttDevices(): Promise<DeviceMqttResponseDTO[]> {
		const topic = process.env.MQTT_DEFAULT_TOPIC!;
		const devices = new Map<string, DeviceMqttResponseDTO>();

		return new Promise((resolve) => {
			const handler = (receivedTopic: string, payload: Buffer) => {
				if (receivedTopic !== topic)
					throw new InternalServerErrorException(
						`Error get connected mqtt devices: received topic != default topic`
					);
				const msg = parseMqttMessage(payload);
				if (!msg || msg.id !== 'report' || !msg.device || !Array.isArray(msg.pins)) return null;

				devices.set(msg.device, {
					device: msg.device,
					pins: msg.pins,
					id: 'report'
				});
			};

			this.mqttService.addHandler(handler);

			this.mqttService.publish(topic, JSON.stringify({id: `device_report`, device: `backend`}));

			setTimeout(() => {
				this.mqttService.removeHandler(handler);
				resolve([...devices.values()]);
			}, 1500);
		});
	}

	async sendAction(data: DeviceSendActionDTO): Promise<string> {
		if (!data) throw new BadRequestException(`Error device sendAction: invalid prop`);
		if (!MatchesMAC(data.id)) throw new BadRequestException(`Error device sendAction: invalid id`);
		if (data.action !== 'read' && data.action !== 'set')
			throw new BadRequestException(`Error device sendAction: invalid action`);
		if (!data.value || !data.value.length)
			throw new BadRequestException(`Error device sendAction: invalid value`);
		const target = await this.DeviceRepo.findOne({
			where: {
				pin: data.pin,
				deviceId: data.id
			}
		});
		if (!target) throw new BadRequestException(`Error device sendAction: target module not found`);
		const resolved = await this.mqttService.publishWithAck(process.env.MQTT_DEFAULT_TOPIC || '', {
			pin: data.pin,
			action: data.action,
			id: data.id,
			value: data.value
		});
		if (typeof resolved !== 'string' || !resolved.length)
			throw new Error(`Error device sendAction: publish promise rejected`);
		return resolved;
	}
}
