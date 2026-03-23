import {
	BadRequestException,
	ConflictException,
	Injectable,
	InternalServerErrorException
} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Device} from 'src/database/entities/device.entity';
import {MatchesMAC} from 'src/global/functions';
import {In, Repository} from 'typeorm';
import {DeviceActionLog} from '../database/entities/dal.entity';
import {
	DeviceActionLogComplete,
	DeviceActionLogCreateDTO,
	DeviceActionLogUpdateStatusDTO,
	DeviceActionStatus
} from './dal.dto';

@Injectable()
export class DeviceActionLogService {
	constructor(
		@InjectRepository(DeviceActionLog) private readonly Repo: Repository<DeviceActionLog>,
		@InjectRepository(Device) private readonly DeviceRepo: Repository<Device>
	) {}

	async completeSingleDalValue(
		value: DeviceActionLog,
		funct: string
	): Promise<DeviceActionLogComplete> {
		const targetDevice = await this.DeviceRepo.findOneBy({id: value.deviceId});
		if (!targetDevice)
			throw new ConflictException(`Error complete value in '${funct}': DeviceID not found`);
		return {...value, device: targetDevice};
	}

	async completeArrayDalValue(
		elements: DeviceActionLog[],
		funct: string
	): Promise<DeviceActionLogComplete[]> {
		if (!elements.length) return [];
		const uniqueDeviceIds = [...new Set(elements.map((e) => e.deviceId))];
		const devices = await this.DeviceRepo.findBy({id: In(uniqueDeviceIds)});
		const deviceMap = new Map<string, Device>();
		for (const d of devices) deviceMap.set(d.id, d);
		return elements.map((e) => {
			const device = deviceMap.get(e.deviceId);
			if (!device)
				throw new ConflictException(
					`Error complete array in '${funct}':Device id '${e.deviceId} not found.`
				);
			return {...e, device};
		});
	}

	async getByDevice(deviceId: string): Promise<DeviceActionLogComplete[]> {
		if (!deviceId || !MatchesMAC(deviceId))
			throw new BadRequestException(`Error get DeviceActionLog by device: bad deviceId`);
		return await this.completeArrayDalValue(await this.Repo.findBy({deviceId}), 'getByDevice');
	}

	async getByStatus(status: DeviceActionStatus): Promise<DeviceActionLogComplete[]> {
		if (!status)
			throw new BadRequestException(`Error get DeviceActionLog by status: bad status received`);
		const elements = await this.Repo.findBy({status});
		if (!elements.length) return [];
		return await this.completeArrayDalValue(elements, 'getByStatus');
	}

	async getByAction(action: 'read' | 'set'): Promise<DeviceActionLogComplete[]> {
		if (action !== 'read' && action !== 'set')
			throw new BadRequestException(`Error get DeviceActionLog by action: bad action received`);
		const elements = await this.Repo.findBy({action});
		if (!elements.length) return [];
		return await this.completeArrayDalValue(elements, 'getByAction');
	}

	async getAll(): Promise<DeviceActionLogComplete[]> {
		const elements = await this.Repo.find();
		if (!elements.length) return [];
		return await this.completeArrayDalValue(elements, 'getAll');
	}

	async createLog(data: DeviceActionLogCreateDTO): Promise<DeviceActionLogComplete> {
		if (!data) throw new Error(`Error create DeviceActionLog: invalid prop`);
		if (data.action !== 'read' && data.action !== 'set')
			throw new Error(
				`Error create DeviceActionLog: invalid prop 'action'= ${JSON.stringify(data.action)}`
			);
		if (!MatchesMAC(data.deviceId))
			throw new Error(`Error create DeviceActionLog: invalid deviceId`);
		if (!data.requestedValue.length)
			throw new Error(`Error create DeviceActionLog: invalid requested value`);
		const targetDevice = await this.DeviceRepo.findOneBy({id: data.deviceId});
		if (!targetDevice) throw new Error(`Error create DeviceActionLog: target device not found`);
		const element = this.Repo.create({
			action: data.action,
			deviceId: data.deviceId,
			pin: data.pin,
			status: DeviceActionStatus.PENDING,
			requestedAt: new Date(),
			requestedValue: data.requestedValue
		});
		const saved = await this.Repo.save(element);

		if (!saved)
			throw new InternalServerErrorException(`Error create DeviceActionLog: cant register in db`);
		return this.completeSingleDalValue(saved, 'createLog');
	}

	async updateLog(data: DeviceActionLogUpdateStatusDTO): Promise<void> {
		await this.Repo.update(data.id, {
			errorMessage: data.errorMessage || null,
			respondedAt: new Date(),
			responseValue: data.responseValue,
			status: data.status
		});
	}
}
