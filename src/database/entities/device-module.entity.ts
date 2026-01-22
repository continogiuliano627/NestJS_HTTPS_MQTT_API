import {Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn} from 'typeorm';
import {Device} from './device.entity';
import {ModuleType} from './module-type.entity';

@Entity('device_module')
export class Device_Module {
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@Column()
	name: string;

	@ManyToOne(() => Device, (device) => device.modules, {onDelete: 'CASCADE'})
	@JoinColumn({name: 'deviceId'})
	device: Device; //

	@Column()
	deviceId: string; //RELATED DEVICE MAC

	@ManyToOne(() => ModuleType)
	@JoinColumn({name: 'typeId'})
	type: ModuleType;

	@Column()
	typeId: string; //ID DEL TIPO DE MODULO
}
