import type {Device_Module} from 'src/database/entities/device-module.entity';

export const DeviceModuleExample: Device_Module = {
	id: '550e8400-e29b-41d4-a716-446655440000',
	name: 'Luces cocina',

	deviceId: 'CC:50:E3:47:D1:DF',
	device: {
		id: 'CC:50:E3:47:D1:DF',
		name: 'ESP Cocina',
		isDeleted: false,
		createdAt: new Date('2026-01-17T10:15:00.000Z'),
		updatedAt: new Date('2026-01-17T10:15:00.000Z'),
		modules: []
	},

	typeId: '2f3a9c7e-91a1-4b6a-b8b1-3d0f2a9e8c44',
	type: {
		id: '2f3a9c7e-91a1-4b6a-b8b1-3d0f2a9e8c44',
		name: 'Relay mecánico',
		kind: 'ACT',
		isDeleted: false
	}
};
