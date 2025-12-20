import {
	BadRequestException,
	ConflictException,
	Injectable,
	InternalServerErrorException,
	NotFoundException
} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {User} from 'src/database/entities/user.entity';
import {UserRole} from 'src/global/enum';
import {deepEqual, PlainObject} from 'src/global/functions';
import {Repository} from 'typeorm';
import {validate as isUuid} from 'uuid';

@Injectable()
export class UserService {
	constructor(
		@InjectRepository(User)
		private readonly repository: Repository<User>
	) {}

	async create(name: string, role: UserRole): Promise<User> {
		if (!role) throw new BadRequestException('Invalid role');
		if (!name?.length || name.length < 3) {
			throw new BadRequestException('Name must contain at least 3 letters');
		}
		const inUse = await this.repository.find({where: {name}});
		if (inUse.length) throw new ConflictException('Name already in use');

		try {
			await this.repository.save({name, role});
		} catch (error) {
			throw new Error(`${error}`);
		}
		const created = await this.repository.findOneBy({name});
		if (!created) throw new InternalServerErrorException('Created but not found');
		return created;
	}

	async findById(id: string): Promise<User> {
		if (!id?.length || !isUuid(id)) throw new ConflictException('ID provided is not UUID');
		const found = await this.repository.findOneBy({id});
		if (!found) throw new NotFoundException('User not found');
		return found;
	}

	async findByName(name: string) {
		if (!name?.length || name.length < 3) throw new ConflictException('Name too short');
		const found = await this.repository.findOneBy({name});
		if (!found) throw new NotFoundException('User not found');
		return found;
	}

	async findByRole(role: UserRole): Promise<User[]> {
		if (!role) throw new BadRequestException('Invalid role');
		const found = await this.repository.findBy({role});
		if (!found) throw new NotFoundException('Elements not found');
		return found;
	}

	async updateUser(id: string, name?: string, role?: UserRole): Promise<User> {
		if (!id || !isUuid(id)) throw new BadRequestException('Invalid ID');
		if (!name?.length && !role) throw new BadRequestException('Missing props');
		if (name && name.length < 3) throw new BadRequestException('Name too short');
		if (role && role !== UserRole.ADMIN && role !== UserRole.USER)
			throw new BadRequestException('Invalid role');
		const target = await this.repository.findOneBy({id});
		if (!target) throw new NotFoundException('User not found');
		const newData: User = {
			id,
			name: name?.length ? name : target.name,
			role: role ? role : target.role,
			createdAt: target.createdAt
		};
		if (deepEqual(target as unknown as PlainObject, newData as unknown as PlainObject))
			return target;
		try {
			await this.repository.save(newData);
		} catch (error) {
			throw new InternalServerErrorException(`${error}`);
		}
		return newData;
	}
}
