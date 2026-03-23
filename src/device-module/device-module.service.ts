import {
	BadRequestException,
	Injectable,
	InternalServerErrorException,
	NotFoundException
} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {isUUID} from 'class-validator';
import {Device_Module} from 'src/database/entities/device-module.entity';
import {Device} from 'src/database/entities/device.entity';
import {ModuleType} from 'src/database/entities/module-type.entity';
import {MatchesMAC} from 'src/global/functions';
import {Repository} from 'typeorm';
import {CreateDeviceModuleDTO, Device_ModuleDTO, UpdateDeviceModuleDTO} from './device-module.dto';

@Injectable()
export class DeviceModuleService {
	constructor(
		@InjectRepository(Device_Module)
		private readonly repository: Repository<Device_Module>,
		@InjectRepository(Device)
		private DeviceRepository: Repository<Device>,
		@InjectRepository(ModuleType)
		private ModuleTypeRepository: Repository<ModuleType>
	) {}

	async create(dto: CreateDeviceModuleDTO): Promise<Device_ModuleDTO> {
		if (!dto) throw new BadRequestException(`Error create Device_module: no prop received`);
		if (!dto.name?.length)
			throw new BadRequestException(`Error create Device_module: no name received`);
		if (!dto.deviceId)
			throw new BadRequestException(`Error create Device_module: no device_id received`);
		if (!dto.typeId)
			throw new BadRequestException(`Error create Device_module: no type_id received`);
		if (!dto.pin) throw new BadRequestException(`Error create Device_module: no pin received`);

		const device = await this.DeviceRepository.findOneBy({id: dto.deviceId});
		if (!device)
			throw new NotFoundException(
				`Error create Device_module: no device found for id '${dto.deviceId}'`
			);
		const type = await this.ModuleTypeRepository.findOneBy({id: dto.typeId});
		if (!type)
			throw new NotFoundException(
				`Error create Device_module: no type found for id '${dto.typeId}'`
			);
		const entity = this.repository.create({
			name: dto.name,
			device: device,
			type,
			icon: -1,
			pin: dto.pin
		});
		let saved: Device_Module | null = null;
		try {
			saved = await this.repository.save(entity);
		} catch (error) {
			throw new InternalServerErrorException(
				`Error create Device_module: ${JSON.stringify(error)}`
			);
		}
		return saved as unknown as Device_ModuleDTO;
	}

	async getAll(): Promise<Device_ModuleDTO[]> {
		const elements = await this.repository.find({relations: ['device', 'type']});
		return elements as unknown as Device_ModuleDTO[];
	}

	async getById(id: string): Promise<Device_ModuleDTO> {
		if (!isUUID(id))
			throw new BadRequestException(`Error get Device_module by id: id must be UUID`);
		const targetElement = await this.repository.findOne({
			relations: ['device', 'type'],
			where: {id}
		});
		if (!targetElement)
			throw new NotFoundException(`Error get Device_module by id: element not found`);
		return targetElement;
	}

	async getByDevice(id: string): Promise<Device_ModuleDTO[]> {
		if (!MatchesMAC(id))
			throw new BadRequestException(`Error get Device_module by device: id must be a MAC address`);
		const targetElement = await this.repository.find({
			where: {deviceId: id},
			relations: ['device', 'type']
		});
		if (!targetElement.length) return [];
		return targetElement;
	}

	async getByType(id: string): Promise<Device_ModuleDTO[]> {
		if (!isUUID(id))
			throw new BadRequestException(`Error get Device_module by type: id must be UUID`);
		const targetElement = await this.repository.find({
			where: {typeId: id},
			relations: ['device', 'type']
		});
		return targetElement;
	}

	async updateOne(id: string, dto: UpdateDeviceModuleDTO): Promise<Device_ModuleDTO> {
		if (!isUUID(id)) throw new BadRequestException(`Error update Device_module: id must be UUID`);
		if (!dto) throw new BadRequestException(`Error update Device_module: bad props received`);
		if (
			typeof dto.name !== 'string' &&
			typeof dto.typeId !== 'string' &&
			typeof dto.pin !== 'string' &&
			typeof dto.icon !== 'number'
		)
			throw new BadRequestException(`Error update Device_module: no props to change`);
		const element = await this.repository.findOne({where: {id}, relations: ['device', 'type']});
		if (!element) throw new NotFoundException(`Error update Device_module: element not found`);
		if (
			!dto.name?.length &&
			!dto.typeId?.length &&
			!dto.pin?.length &&
			(typeof dto.icon !== 'number' || dto.icon === element.icon)
		)
			throw new BadRequestException(`Error update Device_module: no props to change`);

		if (typeof dto.name === 'string' && dto.name.length) element.name = dto.name;
		if (typeof dto.typeId === 'string' && dto.typeId.length) {
			const type = await this.ModuleTypeRepository.findOne({
				where: {id: dto.typeId},
				relations: ['device', 'type']
			});
			if (!type) throw new NotFoundException(`Error update Device_module: type not found`);
			element.type = type;
		}
		if (typeof dto.pin === 'string') element.pin = dto.pin;
		if (typeof dto.icon === 'number') element.icon = dto.icon;

		let updated: Device_Module | null = null;
		try {
			updated = await this.repository.save(element);
		} catch (error) {
			throw new InternalServerErrorException(
				`Error update Device_module: ${JSON.stringify(error)}`
			);
		}
		if (!updated)
			throw new InternalServerErrorException(`Error update Device_module: updated went null`);
		return updated;
	}

	async setIcon(id: string, index: number): Promise<number> {
		if (!isUUID(id)) throw new BadRequestException(`Error set Device_module icon: bad id received`);
		if (typeof index !== 'number')
			throw new BadRequestException(`Error set Device_module icon: invalid index`);
		const target = await this.repository.findOneBy({id});
		if (!target)
			throw new BadRequestException(`Error set Device_module icon: target doesnt exists`);
		const result = await this.repository.update(id, {icon: index});
		if (!result.affected)
			throw new InternalServerErrorException(`Error set Device_module icon: couldnt update`);
		return index;
	}

	async deleteOne(id: string): Promise<boolean> {
		if (!isUUID(id)) throw new BadRequestException(`Error delete Device_module: id must be UUID`);
		const element = await this.repository.findOneBy({id});
		if (!element) throw new NotFoundException(`Error delete Device_module: element not found`);
		const result = await this.repository.delete(id);
		if (!result.affected) throw new NotFoundException(`Error delete Device_module: not found`);
		return true;
	}
}
