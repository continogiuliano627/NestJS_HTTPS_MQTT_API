import {IsBoolean, IsString, IsUUID} from 'class-validator';
import {CreateDateColumn, UpdateDateColumn} from 'typeorm';

export const DeviceExample: DeviceDTO = {
	id: '552a5eca-ec23-431d-a95e-04e582e65dcf',
	name: 'Modulo Luces Entrada',
	isDeleted: false,
	createdAt: new Date('1997-12-22T15:13:00Z'),
	updatedAt: new Date('2026-01-04T00:23:00Z')
};

export class DeviceDTO {
	@IsUUID()
	@IsString()
	id: string;

	@IsString()
	name: string;

	@IsBoolean()
	isDeleted: boolean;

	@UpdateDateColumn()
	updatedAt: Date;

	@CreateDateColumn()
	createdAt: Date;
}

export class DeviceUpdateDTO {
	@IsUUID()
	@IsString()
	id: string;

	@IsString()
	name?: string;

	@IsBoolean()
	isDeleted?: boolean;
}

export class DeviceDeleteDTO {
	@IsUUID()
	@IsString()
	id: string;

	@IsBoolean()
	force: boolean;
}
