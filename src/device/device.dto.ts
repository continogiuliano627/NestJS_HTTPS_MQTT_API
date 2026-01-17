import {IsBoolean, IsString, Matches} from 'class-validator';
import {CreateDateColumn, UpdateDateColumn} from 'typeorm';

export const DeviceExample: DeviceDTO = {
	id: 'AA:A1:BC:EE:56:65',
	name: 'Modulo Luces Entrada',
	isDeleted: false,
	createdAt: new Date('1997-12-22T15:13:00Z'),
	updatedAt: new Date('2026-01-04T00:23:00Z')
};

export class DeviceDTO {
	@Matches(/^([0-9A-F]{2}:){5}[0-9A-F]{2}$/i)
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
	@Matches(/^([0-9A-F]{2}:){5}[0-9A-F]{2}$/i)
	@IsString()
	id: string;

	@IsString()
	name?: string;

	@IsBoolean()
	isDeleted?: boolean;
}

export class DeviceDeleteDTO {
	@Matches(/^([0-9A-F]{2}:){5}[0-9A-F]{2}$/i)
	@IsString()
	id: string;
	@IsBoolean()
	force: boolean;
}
