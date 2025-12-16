import {IsString} from 'class-validator';

export class CreateTempSensorDto {
	@IsString()
	name!: string;

	@IsString()
	device?: string;
}
