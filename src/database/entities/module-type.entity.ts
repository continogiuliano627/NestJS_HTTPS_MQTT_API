import {Column, Entity, PrimaryGeneratedColumn} from 'typeorm';

@Entity('module_type')
export class ModuleType {
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@Column({unique: true})
	name: string;
}
