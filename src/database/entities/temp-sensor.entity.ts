import {Column, Entity, PrimaryGeneratedColumn} from 'typeorm';

@Entity({name: 'temp_sensor'})
export class TempSenor {
	@PrimaryGeneratedColumn('uuid')
	id!: string;

	@Column({type: 'text'})
	name!: string;

	@Column({type: 'text'})
	device!: string;

	@Column({
		type: 'datetime',
		default: () => 'CURRENT_TIMESTAMP'
	})
	timestamp!: Date;
}
