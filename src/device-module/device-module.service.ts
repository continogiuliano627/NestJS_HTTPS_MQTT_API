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
import {In, Repository} from 'typeorm';
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

	async makeRelations(elements: Device_Module[]): Promise<Device_ModuleDTO[]> {
		if (!elements.length) return [];

		const relatedDevices = new Set<string>();
		const relatedTypes = new Set<string>();

		for (const e of elements) {
			relatedDevices.add(e.deviceId);
			relatedTypes.add(e.typeId);
		}
		const [targetDevices, targetTypes] = await Promise.all([
			this.DeviceRepository.find({where: {id: In([...relatedDevices])}}),
			this.ModuleTypeRepository.find({where: {id: In([...relatedTypes])}})
		]);

		const deviceMap = new Map(targetDevices.map((d) => [d.id, d]));
		const typeMap = new Map(targetTypes.map((t) => [t.id, t]));

		return elements.map((e) => {
			const device = deviceMap.get(e.deviceId);
			const type = typeMap.get(e.typeId);
			if (!device || !type)
				throw new InternalServerErrorException(
					`Error make device_module relations: Broken foring key reference`
				);
			return {
				id: e.id,
				name: e.name,
				device,
				deviceId: e.deviceId,
				type,
				typeId: e.typeId
			};
		});
	}

	async create(dto: CreateDeviceModuleDTO): Promise<Device_ModuleDTO> {
		if (!dto) throw new BadRequestException(`Error create Device_module: no prop received`);
		if (!dto.name?.length)
			throw new BadRequestException(`Error create Device_module: no name received`);
		if (!dto.deviceId)
			throw new BadRequestException(`Error create Device_module: no device_id received`);
		if (!dto.typeId)
			throw new BadRequestException(`Error create Device_module: no type_id received`);
		const device = await this.DeviceRepository.findOne({
			where: {
				id: dto.deviceId
			}
		});
		if (!device)
			throw new NotFoundException(
				`Error create Device_module: no device found for id '${dto.deviceId}'`
			);
		const type = await this.ModuleTypeRepository.findOne({
			where: {
				id: dto.typeId
			}
		});
		if (!type)
			throw new NotFoundException(
				`Error create Device_module: no type found for id '${dto.typeId}'`
			);

		let saved: Device_Module | null = null;
		try {
			const entity = this.repository.create(dto);
			saved = await this.repository.save(entity);
		} catch (error) {
			throw new InternalServerErrorException(
				`Error create Device_module: ${JSON.stringify(error)}`
			);
		}
		if (!saved)
			throw new InternalServerErrorException(
				`Error create Device_module: cant save '${JSON.stringify(saved)}'`
			);
		return (await this.makeRelations([saved]))[0];
	}

	async getAll(): Promise<Device_ModuleDTO[]> {
		const elements = await this.repository.find();
		return this.makeRelations(elements);
	}

	async getById(id: string): Promise<Device_ModuleDTO> {
		if (!isUUID(id))
			throw new BadRequestException(`Error get Device_module by id: id must be UUID`);
		const targetElement = await this.repository.findOneBy({id});
		if (!targetElement)
			throw new NotFoundException(`Error get Device_module by id: element not found`);
		return (await this.makeRelations([targetElement]))[0];
	}

	async getByDevice(id: string): Promise<Device_ModuleDTO[]> {
		if (!MatchesMAC(id))
			throw new BadRequestException(`Error get Device_module by device: id must be UUID`);
		const targetElement = await this.repository.findBy({deviceId: id});
		if (!targetElement.length) return [];
		return await this.makeRelations(targetElement);
	}

	async getByType(id: string): Promise<Device_ModuleDTO[]> {
		if (!isUUID(id))
			throw new BadRequestException(`Error get Device_module by type: id must be UUID`);
		const targetElement = await this.repository.findBy({typeId: id});
		if (!targetElement.length) return [];
		return await this.makeRelations(targetElement);
	}

	async updateOne(id: string, dto: UpdateDeviceModuleDTO): Promise<Device_ModuleDTO> {
		if (!isUUID(id)) throw new BadRequestException(`Error update Device_module: id must be UUID`);
		if (!dto) throw new BadRequestException(`Error update Device_module: bad props received`);
		if (
			(typeof dto.name !== 'string' && typeof dto.typeId !== 'string') ||
			(!dto.name?.length && !dto.typeId?.length)
		)
			throw new BadRequestException(`Error update Device_module: no props to change`);
		const element = await this.repository.findOneBy({id});
		if (!element) throw new NotFoundException(`Error update Device_module: element not found`);
		if (typeof dto.name === 'string' && dto.name.length) element.name = dto.name;
		if (typeof dto.typeId === 'string' && dto.typeId.length) {
			const type = await this.ModuleTypeRepository.findOneBy({id: dto.typeId});
			if (!type) throw new NotFoundException(`Error update Device_module: type not found`);
			element.typeId = dto.typeId;
		}

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
		return (await this.makeRelations([updated]))[0];
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
