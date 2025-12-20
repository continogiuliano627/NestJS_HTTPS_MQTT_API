import {Column, CreateDateColumn, Entity, PrimaryGeneratedColumn} from 'typeorm';

import {UserRole} from 'src/global/enum';

@Entity('users')
export class User {
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@Column({unique: true})
	name: string;

	@Column({
		type: 'text',
		default: UserRole.USER
	})
	role: UserRole;

	@CreateDateColumn()
	createdAt: Date;
}
