import type {Device} from 'src/database/entities/device.entity';
import {DeviceExample} from 'src/device/device.dto';

export enum DeviceActionStatus {
	PENDING = 'pending',
	ACK = 'ack',
	TIMEOUT = 'timeout',
	ERROR = 'error'
}

export class DeviceActionLogComplete {
	id: string;
	deviceId: string;
	device: Device;
	pin: string;
	action: 'read' | 'set';
	requestedValue: string;
	responseValue: string | null;
	status: DeviceActionStatus;
	requestedAt: Date;
	respondedAt: Date | null;
	errorMessage: string | null;
}

export class DeviceActionLogCreateDTO {
	deviceId: string;
	pin: string;
	action: 'read' | 'set';
	requestedValue: string;
}

export class DeviceActionLogUpdateStatusDTO {
	id: string;
	responseValue: string;
	status: DeviceActionStatus;
	errorMessage: string | null;
}

export const DeviceActionLogExampleRead: DeviceActionLogComplete = {
	action: 'read',
	device: DeviceExample,
	deviceId: DeviceExample.id,
	errorMessage: null,
	id: 'ad2055f7-1257-4ddb-a7dd-c2748e425143',
	pin: '2',
	requestedAt: new Date('2023-07-22T09:35:27Z'),
	status: DeviceActionStatus.ACK,
	requestedValue: '-1',
	respondedAt: new Date('2023-07-22T09:35:28Z'),
	responseValue: 'HIGH'
};
export const DeviceActionLogExampleSet: DeviceActionLogComplete = {
	action: 'set',
	device: DeviceExample,
	deviceId: DeviceExample.id,
	errorMessage: null,
	id: 'ad2055f7-1257-4ddb-a7dd-c2748e425143',
	pin: '2',
	requestedAt: new Date('2023-07-22T09:35:27Z'),
	status: DeviceActionStatus.ACK,
	requestedValue: 'LOW',
	respondedAt: new Date('2023-07-22T09:35:28Z'),
	responseValue: 'HIGH'
};
