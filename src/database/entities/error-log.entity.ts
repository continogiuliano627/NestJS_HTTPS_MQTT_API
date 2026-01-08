import {Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn} from 'typeorm';

@Entity('error-log')
export class ErrorLog {
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@Column()
	sourceTable: string;

	@Column()
	sourceFunction: string;

	@Column('text')
	data: string;

	@Column({default: false, type: 'boolean'})
	fixed: boolean;

	@CreateDateColumn()
	createdAt: Date;

	@UpdateDateColumn()
	updatedAt: Date;
}
