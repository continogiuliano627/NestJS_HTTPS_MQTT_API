export interface DeviceMqttResponseDTO {
	id: 'report';
	device: string;
}

export const parseMqttMessage = (payload: Buffer): DeviceMqttResponseDTO | null => {
	let parsed: unknown;

	try {
		parsed = JSON.parse(payload.toString('utf8'));
	} catch (error) {
		{
			console.error(`failed try catch: ${JSON.stringify(error)}`);
			return null;
		}
	}

	if (typeof parsed !== 'object' || parsed === null) {
		console.error(`failed typeof parsed: ${JSON.stringify(typeof parsed)}, ${parsed === null} `);
		return null;
	}
	if (!('id' in parsed) || !('device' in parsed)) {
		console.error(
			`failed id or device in parsed: ${JSON.stringify('id' in parsed)}, ${JSON.stringify('device' in parsed)} `
		);
		return null;
	}
	if ((parsed as {id: unknown}).id !== 'report') {
		if ((parsed as {id: unknown}).id !== 'device_report')
			console.error(`failed id value: ${JSON.stringify(parsed.id)}`);
		return null;
	}
	if (typeof (parsed as {device: unknown}).device !== 'string') {
		console.error(`failed device type: ${typeof parsed.device}`);
		return null;
	}

	return parsed as DeviceMqttResponseDTO;
};
