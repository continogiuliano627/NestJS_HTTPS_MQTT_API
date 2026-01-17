import {
	Column,
	CreateDateColumn,
	Entity,
	OneToMany,
	PrimaryColumn,
	UpdateDateColumn
} from 'typeorm';
import {DeviceModule} from './device-module.entity';

@Entity('devices')
export class Device {
	@PrimaryColumn({type: 'text'})
	id: string;

	@Column({unique: false})
	name: string;

	@Column({default: false, type: 'boolean'})
	isDeleted: boolean;

	@OneToMany(() => DeviceModule, (module) => module.device)
	modules: DeviceModule[];

	@CreateDateColumn()
	createdAt: Date;

	@UpdateDateColumn()
	updatedAt: Date;
}
