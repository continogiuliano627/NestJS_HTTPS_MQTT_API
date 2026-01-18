import {
	Column,
	CreateDateColumn,
	Entity,
	OneToMany,
	PrimaryColumn,
	UpdateDateColumn
} from 'typeorm';
import {Device_Module} from './device-module.entity';

@Entity('devices')
export class Device {
	@PrimaryColumn({type: 'text'})
	id: string;

	@Column({unique: false})
	name: string;

	@Column({default: false, type: 'boolean'})
	isDeleted: boolean;

	@OneToMany(() => Device_Module, (module) => module.device)
	modules: Device_Module[];

	@CreateDateColumn()
	createdAt: Date;

	@UpdateDateColumn()
	updatedAt: Date;
}
