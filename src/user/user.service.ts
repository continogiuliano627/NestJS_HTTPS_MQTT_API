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
		private repository: Repository<User>
	) {}

	async create(name: string, role: UserRole): Promise<User> {
		if (!role || (role !== UserRole.ADMIN && role !== UserRole.USER))
			throw new BadRequestException('Error create user: Invalid role');
		if (!name?.length || name.length < 3) {
			throw new BadRequestException('Error create user: Name must contain at least 3 letters');
		}
		const inUse = await this.repository.find({where: {name}});
		if (inUse.length) throw new ConflictException('Error create user: Name already in use');
		try {
			await this.repository.save({name, role});
		} catch (error) {
			throw new Error(`${error}`);
		}
		const created = await this.repository.findOneBy({name});
		if (!created)
			throw new InternalServerErrorException('Error create user: Created but not found');
		return created;
	}

	async findById(id: string): Promise<User> {
		if (!id?.length || !isUuid(id))
			throw new ConflictException('Error find user byId: ID provided is not UUID');
		const found = await this.repository.findOneBy({id});
		if (!found) throw new NotFoundException('Error find user byIdUser not found');
		return found;
	}

	async findByName(name: string) {
		if (!name?.length || name.length < 3)
			throw new ConflictException('Error find user byName:Name too short');
		const found = await this.repository.findOneBy({name});
		if (!found) throw new NotFoundException('Error find user byName:User not found');
		return found;
	}

	async findByRole(role: UserRole): Promise<User[]> {
		if (!role) throw new BadRequestException('Error find user byRole: Invalid role');
		const found = await this.repository.findBy({role});
		if (!found) throw new NotFoundException('Error find user byRole: Elements not found');
		return found;
	}

	async updateUser(id: string, name?: string, role?: UserRole, isDeleted?: boolean): Promise<User> {
		if (!id || !isUuid(id)) throw new BadRequestException('Error update user: Invalid ID');
		if (!name?.length && !role && typeof isDeleted !== 'boolean')
			throw new BadRequestException('Error update user: Missing props');
		if (name && name.length < 3) throw new BadRequestException('Error update user: Name too short');
		if (role && role !== UserRole.ADMIN && role !== UserRole.USER)
			throw new BadRequestException('Error update user: Invalid role');
		const target = await this.repository.findOneBy({id});
		if (!target) throw new NotFoundException('Error update user: User not found');
		if (target.isDeleted && (typeof isDeleted !== 'boolean' || isDeleted))
			throw new BadRequestException(
				'Error update user: deleted user cannot be updated only restored.'
			);
		const newData: User = {
			id,
			name: name?.length ? name : target.name,
			role: role ? role : target.role,
			createdAt: target.createdAt,
			updatedAt: new Date(),
			isDeleted: typeof isDeleted === 'boolean' ? isDeleted : target.isDeleted
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

	async getAll(): Promise<User[]> {
		const found = await this.repository.find();
		return found;
	}

	async getDeleted(): Promise<User[]> {
		return this.repository.findBy({isDeleted: true});
	}

	async deleteOne(id: string): Promise<boolean> {
		if (!id?.length || (id.length && !isUuid(id)))
			throw new BadRequestException(`Error delete user: bad id received: "${id}"`);
		const found = await this.repository.findOne({
			where: {
				id
			}
		});
		if (!found) throw new NotFoundException('Error delete user: User not found');
		if (found.isDeleted) throw new BadRequestException('Error delete user: User already deleted');
		const usersQuantity = await this.repository.count();
		if (usersQuantity === 1)
			throw new ConflictException('Error delete user: Cannot delete the only existing user');
		try {
			await this.repository.save({
				...found,
				isDeleted: true
			});
		} catch (error) {
			throw new Error(`Error delete user: ${JSON.stringify(error)}`);
		}
		return true;
	}
}
