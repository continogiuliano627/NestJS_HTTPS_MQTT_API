import {Column, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn} from 'typeorm';
import {Device} from './device.entity';
import {ModuleType} from './module-type.entity';

@Entity('device_module')
export class Device_Module {
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@Column()
	name: string;

	@Column()
	pin: string;

	@Index()
	@Column()
	deviceId: string; //RELATED DEVICE MAC

	@ManyToOne(() => Device, {onDelete: 'CASCADE'})
	@JoinColumn({name: 'deviceId'})
	device: Device;

	@Index()
	@Column()
	typeId: string; //ID DEL TIPO DE MODULO

	@ManyToOne(() => ModuleType, {onDelete: 'CASCADE'})
	@JoinColumn({name: 'typeId'})
	type: ModuleType;

	@Column({type: 'int', default: -1})
	icon: number;
}
