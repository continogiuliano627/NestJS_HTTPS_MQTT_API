import {Column, CreateDateColumn, Entity, Index, PrimaryGeneratedColumn} from 'typeorm';
import {DeviceActionStatus} from '../../device_action_log/dal.dto';

@Entity({name: 'device_action_log'})
@Index(['deviceId'])
@Index(['requestedAt'])
@Index(['status'])
export class DeviceActionLog {
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@Column({type: 'varchar', name: 'device_id'})
	deviceId: string;

	@Column({type: 'varchar', length: 8})
	pin: string;

	@Column({type: 'varchar', length: 10})
	action: 'read' | 'set';

	@Column({type: 'varchar', length: 16, name: 'requested_value'})
	requestedValue: string;

	@Column({type: 'varchar', length: 16, name: 'response_value', nullable: true})
	responseValue: string | null;

	@Column({type: 'varchar', length: 16})
	status: DeviceActionStatus;

	@CreateDateColumn({type: 'datetime', name: 'requested_at'})
	requestedAt: Date;

	@Column({type: 'datetime', name: 'responded_at', nullable: true})
	respondedAt: Date | null;

	@Column({type: 'text', name: 'error_message', nullable: true})
	errorMessage: string | null;
}
