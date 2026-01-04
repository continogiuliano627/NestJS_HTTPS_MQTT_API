import {Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn} from 'typeorm';

@Entity('devices')
export class Device {
	@PrimaryGeneratedColumn('uuid')
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
