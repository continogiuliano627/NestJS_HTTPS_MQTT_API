import {
	BadRequestException,
	Injectable,
	InternalServerErrorException,
	NotFoundException
} from '@nestjs/common';
import {Cron} from '@nestjs/schedule';
import {InjectRepository} from '@nestjs/typeorm';
import {isUUID} from 'class-validator';
import {ErrorLog} from 'src/database/entities/error-log.entity';
import {Between, DataSource, Repository} from 'typeorm';
@Injectable()
export class ErrorLogsService {
	constructor(
		@InjectRepository(ErrorLog)
		private readonly repository: Repository<ErrorLog>,
		private readonly dataSource: DataSource
	) {}

	@Cron('0 3 * * *') //a las 03 del server
	async cleanup() {
		await this.dataSource.query(`
            DELETE FROM error_log
            WHERE createdAt <= datetime('now', '-30 days')
            `);
	}

	async createOne(sourceTable: string, sourceFunction: string, data: string): Promise<void> {
		if (!sourceFunction.length || !sourceFunction.length || !data.length)
			throw new BadRequestException('Error generate error_log: incompleted data');
		try {
			await this.repository.save({data, sourceFunction, sourceTable});
		} catch (error) {
			throw new InternalServerErrorException(`Error saving error_log: '${JSON.stringify(error)}'`);
		}
	}

	async getAll(): Promise<ErrorLog[]> {
		return this.repository.find();
	}

	async getById(id: string): Promise<ErrorLog> {
		if (!isUUID(id)) throw new BadRequestException('Error get error_log by id: ID is not uuid');
		const found = await this.repository.findOneBy({id});
		if (!found) throw new NotFoundException();
		return found;
	}

	async getByTable(table: string): Promise<ErrorLog[]> {
		if (!table.length)
			throw new BadRequestException('Error get error_log by table: no table received');
		const found = await this.repository.findBy({sourceTable: table});
		if (!found) throw new NotFoundException();
		return found;
	}

	async setFixed(id: string): Promise<ErrorLog> {
		if (!isUUID(id)) throw new BadRequestException('Error set fixed error_log: ID is not uuid');
		const target = await this.repository.findOneBy({id});
		if (!target) throw new NotFoundException();
		try {
			await this.repository.save({...target, fixed: true});
		} catch (error) {
			throw new InternalServerErrorException(
				`Error set fixed error_log: '${JSON.stringify(error)}'`
			);
		}
		const updated = await this.repository.findOneBy({id, fixed: true});
		if (!updated)
			throw new InternalServerErrorException('Error set fixed error_log: not updated or not found');
		return updated;
	}

	async getByDate(initialDate: Date, finalDate: Date): Promise<ErrorLog[]> {
		if (!(initialDate && finalDate))
			throw new BadRequestException('Error get error_log by date: Missing date');
		const found = await this.repository.find({
			where: {
				createdAt: Between(initialDate, finalDate)
			}
		});
		return found;
	}
}
