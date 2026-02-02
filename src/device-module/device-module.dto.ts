import type {Device} from 'src/database/entities/device.entity';
import type {ModuleType} from 'src/database/entities/module-type.entity';
import {DeviceExample} from 'src/device/device.dto';
import {ModuleTypeExample} from 'src/module-type/module-type.dto';

export class Device_ModuleDTO {
	id: string;
	name: string;
	deviceId: string;
	device: Device;
	typeId: string;
	type: ModuleType;
	pin: string;
	icon: number;
}

export const DeviceModuleExample: Device_ModuleDTO = {
	id: '550e8400-e29b-41d4-a716-446655440000',
	name: 'Luces cocina',
	pin: '2',
	deviceId: 'CC:50:E3:47:D1:DF',
	device: DeviceExample,
	typeId: '2f3a9c7e-91a1-4b6a-b8b1-3d0f2a9e8c44',
	type: ModuleTypeExample,
	icon: -1
};

export class CreateDeviceModuleDTO {
	name: string;
	pin: string;
	deviceId: string;
	typeId: string;
	icon: number;
}

export class UpdateDeviceModuleDTO {
	name?: string;
	typeId?: string;
	pin?: string;
	icon?: number;
}
