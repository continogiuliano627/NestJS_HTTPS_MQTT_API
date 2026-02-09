import type {DeviceActionLog} from 'src/database/entities/dal.entity';
import type {Device} from 'src/database/entities/device.entity';

export interface DeviceEventComplete extends DeviceActionLog {
	device: Device;
}
