import {Column, Entity, Index, PrimaryGeneratedColumn} from 'typeorm';

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

	@Index()
	@Column()
	typeId: string; //ID DEL TIPO DE MODULO

	@Column({type: 'int', default: -1})
	icon: number;
}
