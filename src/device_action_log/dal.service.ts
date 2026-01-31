import {BadRequestException, ConflictException, Injectable} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Device} from 'src/database/entities/device.entity';
import {MatchesMAC} from 'src/global/functions';
import {In, Repository} from 'typeorm';
import {DeviceActionLog} from '../database/entities/dal.entity';
import {DeviceActionLogComplete, DeviceActionStatus} from './dal.dto';

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
}
