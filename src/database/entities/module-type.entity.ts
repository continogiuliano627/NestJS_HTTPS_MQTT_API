import {ModuleKind} from 'src/global/enum';
import {Column, Entity, PrimaryGeneratedColumn} from 'typeorm';

@Entity('module_type')
export class ModuleType {
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@Column({unique: true})
	name: string;

	@Column({
		type: 'text'
	})
	kind: ModuleKind;

	@Column({type: 'boolean', default: false})
	isDeleted: boolean;
}
