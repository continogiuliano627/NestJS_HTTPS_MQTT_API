import {Controller, Get, Param} from '@nestjs/common';
import {ApiOperation, ApiParam, ApiResponse} from '@nestjs/swagger';
import {DeviceExample} from 'src/device/device.dto';
import {DeviceActionLogExampleRead, DeviceActionLogExampleSet, DeviceActionStatus} from './dal.dto';
import {DeviceActionLogService} from './dal.service';

@Controller('DeviceActionLogController')
export class DeviceActionLogController {
	constructor(private readonly Service: DeviceActionLogService) {}

	@Get('/getAll')
	@ApiOperation({
		summary: 'Get all Device Action Logs'
	})
	@ApiResponse({
		description: 'Array with the found elements',
		status: 200,
		example: [DeviceActionLogExampleRead, DeviceActionLogExampleSet]
	})
	getAll() {
		return this.Service.getAll();
	}

	@Get('device/:id')
	@ApiOperation({
		summary: 'Get all logs by device'
	})
	@ApiParam({
		name: 'id',
		type: 'string',
		description: 'Id of the target device',
		example: DeviceExample.id
	})
	@ApiResponse({
		status: 200,
		isArray: true,
		description: 'Array of the found elements',
		example: [DeviceActionLogExampleRead, DeviceActionLogExampleSet]
	})
	getByDevice(@Param('id') id: string) {
		return this.Service.getByDevice(id);
	}

	@Get('device/:status')
	@ApiOperation({
		summary: 'Get all logs by status'
	})
	@ApiParam({
		name: 'status',
		type: 'string',
		description: 'status of the target logs',
		examples: {
			ACK: {
				value: {
					status: DeviceActionStatus.ACK
				}
			},
			PENDING: {
				value: {
					status: DeviceActionStatus.PENDING
				}
			},
			TIMEOUT: {
				value: {
					status: DeviceActionStatus.TIMEOUT
				}
			},
			ERROR: {
				value: {
					status: DeviceActionStatus.ERROR
				}
			}
		}
	})
	@ApiResponse({
		status: 200,
		isArray: true,
		description: 'Array of the found elements',
		example: [DeviceActionLogExampleRead, DeviceActionLogExampleSet]
	})
	getByStatus(@Param('status') status: DeviceActionStatus) {
		return this.Service.getByStatus(status);
	}

	@Get('device/:action')
	@ApiOperation({
		summary: 'Get all logs by action'
	})
	@ApiParam({
		name: 'action',
		type: 'string',
		description: 'action of the target logs',
		examples: {
			Read: {
				value: {
					action: 'read'
				}
			},
			Set: {
				value: {
					action: 'set'
				}
			}
		}
	})
	@ApiResponse({
		status: 200,
		isArray: true,
		description: 'Array of the found elements',
		example: [DeviceActionLogExampleRead, DeviceActionLogExampleSet]
	})
	getByAction(@Param('action') action: 'set' | 'read') {
		return this.Service.getByAction(action);
	}
}
