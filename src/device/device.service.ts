import {
	BadRequestException,
	ConflictException,
	Injectable,
	InternalServerErrorException,
	NotFoundException
} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {isUUID} from 'class-validator';
import {Device} from 'src/database/entities/device.entity';
import {Repository} from 'typeorm';
import {DeviceDeleteDTO, DeviceUpdateDTO} from './device.dto';

@Injectable()
export class DeviceService {
	constructor(@InjectRepository(Device) private repository: Repository<Device>) {}

	async createOne(name: string): Promise<Device> {
		if (!name || name.length < 3)
			throw new BadRequestException('Error creating device: invalid name received');
		const exists = await this.repository.findOneBy({
			name
		});
		if (exists && !exists.isDeleted)
			throw new ConflictException('Error creating device: Device already exists');
		try {
			await this.repository.save({name});
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
		if (!data.id || !isUUID(data.id))
			throw new BadRequestException('Error updating device: invalid uuid received');
		if (!data.name || data.name.length < 3)
			throw new BadRequestException('Error updating device: invalid name received');
		const target = await this.repository.findOneBy({id: data.id});
		//verificamos que exista y si isDeleted es true debe cambiar, no se puede cambiar un eliminado salvo se restaure
		if (!target || (typeof data.isDeleted === 'boolean' && target.isDeleted && data.isDeleted))
			throw new ConflictException('Error updating device: target device doesnt exists');
		if (data.name && target.name === data.name)
			throw new BadRequestException('Error updating device: new data is the same as existing data');
		if (data.isDeleted && target.isDeleted === data.isDeleted)
			throw new BadRequestException('Error updating device: new data is the same as existing data');
		try {
			await this.repository.save({
				id: data.id,
				name: data.name || target.name,
				isDeleted: typeof data.isDeleted === 'boolean' ? data.isDeleted : target.isDeleted
			});
		} catch (error) {
			throw new InternalServerErrorException(`Error updating device: ${JSON.stringify(error)}`);
		}
		const updated = await this.repository.findOneBy({id: data.id});
		if (!updated)
			throw new ConflictException('Error updating device: device not found after update');
		if (updated.name !== data.name)
			throw new InternalServerErrorException('Error updating device: device name wasnt updated');
		return updated;
	}

	async findById(id: string): Promise<Device> {
		if (!id || !isUUID(id))
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
		return await this.repository.find();
	}

	async findDeleted(): Promise<Device[]> {
		return await this.repository.findBy({isDeleted: true});
	}

	async deleteOne(data: DeviceDeleteDTO): Promise<boolean> {
		if (!data || !data.id || !isUUID(data.id))
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
}
