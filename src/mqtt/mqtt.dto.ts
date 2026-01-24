export type mqttSetMsg = {
	id: string;
	action: 'set';
	pin: string;
	value: 'HIGH' | 'LOW';
};

export type mqttReadMsg = {
	id: string;
	action: 'set' | 'read';
	pin: string;
	value: '-1';
};

export type mqttReportMsg = {
	id: 'device_report';
};

export type mqttReportResp = {
	id: 'report';
	device: string;
};

export type mqttResp = {
	id: string;
	action: string;
	pin: string;
	value: string;
};

export type MqttMessageHandler = (topic: string, payload: Buffer) => void;
export type PendingKey = string;
export interface PendingRequest {
	resolve: (value: string) => void;
	reject: (reason?: unknown) => void;
	timeout: NodeJS.Timeout;
}

export const MqttMessageExample: mqttReadMsg = {
	id: 'DEVICE_MAC',
	action: 'read',
	pin: '0',
	value: '-1'
};
