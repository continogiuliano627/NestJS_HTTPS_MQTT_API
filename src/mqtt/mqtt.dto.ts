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
	action: 'update';
	pin: string;
	value: string;
};

export type MqttMessageHandler = (topic: string, payload: Buffer) => void;
