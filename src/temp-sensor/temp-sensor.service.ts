import {BadRequestException, ConflictException, Injectable} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm';
import {TempSensor} from '../database/entities/temp-sensor.entity';
import {CreateTempSensorDto} from './dto/create-temp-sensor.dto';

@Injectable()
export class TempSensorService {
	constructor(
		@InjectRepository(TempSensor)
		private tempSensorRepository: Repository<TempSensor>
	) {}

	async createOne(data: CreateTempSensorDto): Promise<TempSensor> {
		if (!data.name?.length) throw new BadRequestException('New temp sensor must receive a name.');
		const found = await this.tempSensorRepository.findOne({
			where: {name: data.name}
		});
		if (found)
			throw new ConflictException(
				`Temp sensor with name "${data.name}" already exists with id "${found.id}".`
			);
		let newEntity: TempSensor;
		try {
			newEntity = await this.tempSensorRepository.save({
				name: data.name,
				device: data.device?.length ? data.device : ''
			});
		} catch (error) {
			throw new Error(`Catch error: ${error}`);
		}
		return newEntity;
	}
}
