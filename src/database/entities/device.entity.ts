import {Column, CreateDateColumn, Entity, PrimaryColumn, UpdateDateColumn} from 'typeorm';

@Entity('devices')
export class Device {
	@PrimaryColumn({type: 'text'})
	id: string;

	@Column({unique: false})
	name: string;

	@Column({default: false, type: 'boolean'})
	isDeleted: boolean;

	@CreateDateColumn()
	createdAt: Date;

	@UpdateDateColumn()
	updatedAt: Date;
}
