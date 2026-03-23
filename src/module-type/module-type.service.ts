import {
	BadRequestException,
	ConflictException,
	Injectable,
	InternalServerErrorException,
	NotFoundException
} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {isUUID} from 'class-validator';
import {ModuleType} from 'src/database/entities/module-type.entity';
import {ModuleKind} from 'src/global/enum';
import {Repository} from 'typeorm';

@Injectable()
export class ModuleTypeService {
	constructor(@InjectRepository(ModuleType) private repository: Repository<ModuleType>) {}

	async createOne(name: string, kind: ModuleKind): Promise<ModuleType> {
		if (!name || name.length < 3)
			throw new BadRequestException(`Error create new module type: invalid name`);
		if (!kind || (kind !== 'ACT' && kind !== 'READ'))
			throw new BadRequestException(`Error create new module type: invalid kind`);
		const inUse = await this.repository.findOneBy({name});
		if (inUse) throw new ConflictException(`Error create new module type: name already in use`);
		try {
			await this.repository.save({name, kind});
		} catch (error) {
			throw new InternalServerErrorException(
				`Error create new module type: ${JSON.stringify(error)}`
			);
		}
		const created = await this.repository.findOneBy({name});
		if (!created)
			throw new InternalServerErrorException(`Error create new module type: created but not found`);
		return created;
	}

	async deleteOne(id: string): Promise<ModuleType> {
		if (!isUUID(id)) throw new BadRequestException(`Error delete module type: invalid ID`);
		const target = await this.repository.findOneBy({id});
		if (!target) throw new NotFoundException(`Error delete module type: target not found`);
		if (target.isDeleted)
			throw new BadRequestException(`Error delete module type: target already deleted`);
		try {
			await this.repository.save({...target, isDeleted: true});
		} catch (error) {
			throw new InternalServerErrorException(`Error delete module type: ${JSON.stringify(error)}`);
		}
		const deleted = await this.repository.findOneBy({id});
		if (!deleted)
			throw new InternalServerErrorException(`Error delete module type: updated but not found`);
		if (!deleted.isDeleted)
			throw new InternalServerErrorException(`Error delete module type: target not updated`);
		return deleted;
	}

	async getByName(name: string): Promise<ModuleType> {
		if (!name || name.length < 3)
			throw new BadRequestException(`Error get Module type by name: invalid name`);
		const target = await this.repository.findOneBy({name});
		if (!target) throw new NotFoundException(`Error get module type by name: element not found`);
		return target;
	}

	async getById(id: string): Promise<ModuleType> {
		if (!isUUID(id)) throw new BadRequestException(`Error get Module type by id: invalid id`);
		const target = await this.repository.findOneBy({id});
		if (!target) throw new NotFoundException(`Error get module type by id: element not found`);
		return target;
	}

	async getAll(): Promise<ModuleType[]> {
		return this.repository.find();
	}

	async updateOne(id: string, name: string, kind: ModuleKind): Promise<ModuleType> {
		if (!isUUID(id)) throw new BadRequestException(`Error update ModuleType: bad uuid received`);
		if (!name || name.length < 3)
			throw new BadRequestException(`Error update ModuleType: bad name received`);
		if (!kind || (kind !== 'ACT' && kind !== 'READ'))
			throw new BadRequestException(`Error updateModuleType: invalid kind`);
		const target = await this.repository.findOneBy({id});
		if (!target) throw new BadRequestException(`Error update ModuleType: target not found`);
		if (target.name === name && target.kind === kind)
			throw new BadRequestException(`Error update ModuleType: no value to be changed`);
		const inUse = await this.repository.findOneBy({name});
		if (inUse) throw new ConflictException(`Error update ModuleType: name already in use`);
		try {
			await this.repository.save({...target, name, kind});
		} catch (error) {
			throw new InternalServerErrorException(`Error update ModuleType: ${JSON.stringify(error)}`);
		}
		const updated = await this.repository.findOneBy({id});
		if (!updated)
			throw new InternalServerErrorException(`Error update ModuleType: updated but not found`);
		if (updated.name !== name)
			throw new InternalServerErrorException(`Error update ModuleType: update didnt applied`);
		return updated;
	}

	async restoreOne(id: string): Promise<ModuleType> {
		if (!isUUID(id)) throw new BadRequestException(`Error restore ModuleType: bad id received`);
		const target = await this.repository.findOneBy({id});
		if (!target) throw new NotFoundException(`Error restore ModuleType: target not found`);
		if (!target.isDeleted)
			throw new BadRequestException(
				`Error restore ModuleType: attempted to restore a non deleted ModuleType`
			);
		try {
			await this.repository.save({...target, isDeleted: false});
		} catch (error) {
			throw new InternalServerErrorException(`Error restore ModuleType: ${JSON.stringify(error)}`);
		}
		const updated = await this.repository.findOneBy({id});
		if (!updated)
			throw new InternalServerErrorException(`Error restore ModuleType: updated but not found`);
		if (updated.isDeleted)
			throw new InternalServerErrorException(`Error restore ModuleType: update wasnt applied`);
		return updated;
	}
}
