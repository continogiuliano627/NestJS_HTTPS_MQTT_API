import {Controller, Delete, Get, Param, Query} from '@nestjs/common';
import {ApiOperation, ApiParam, ApiQuery, ApiResponse} from '@nestjs/swagger';
import {DeviceActionLog} from 'src/database/entities/dal.entity';
import {DeviceEventService} from './DeviceEvent.service';

@Controller()
export class DeviceEventController {
	constructor(private readonly Service: DeviceEventService) {}

	@Get('event/device/:param')
	@ApiOperation({
		summary: 'Get device events by device MAC',
		description: 'Returns all device action logs associated with a specific device MAC address.'
	})
	@ApiParam({
		name: 'param',
		required: true,
		description: 'Device MAC address',
		example: '48:55:19:15:D4:8B'
	})
	@ApiResponse({
		status: 200,
		description: 'List of device action logs retrieved successfully.'
	})
	@ApiResponse({
		status: 400,
		description: 'Invalid MAC address format.'
	})
	getByDevice(@Param('param') param: string) {
		return this.Service.getByDevice(param);
	}
	@Get('event/module/:param')
	@ApiOperation({
		summary: 'Get device action logs by module id',
		description:
			'Returns all action logs associated to a specific device module. The relation is resolved using the module deviceId and pin.'
	})
	@ApiParam({
		name: 'param',
		type: 'string',
		format: 'uuid',
		required: true,
		description: 'UUID of the device module'
	})
	@ApiResponse({
		status: 200,
		description: 'List of action logs associated to the module',
		type: DeviceActionLog,
		isArray: true
	})
	@ApiResponse({
		status: 400,
		description: 'Invalid module id'
	})
	@ApiResponse({
		status: 404,
		description: 'Module not found'
	})
	getEventsByModule(@Param('param') param: string) {
		return this.Service.getEventsByModule(param);
	}

	@Delete('event/delete')
	@ApiOperation({
		summary: 'Delete device action logs between two dates',
		description:
			'Deletes all device action logs whose requestedAt is between the provided start and finish dates (inclusive). Dates must be ISO 8601 strings.'
	})
	@ApiQuery({
		name: 'initDate',
		required: true,
		type: String,
		description: 'Start date (ISO 8601). Example: 2026-02-01T00:00:00.000Z'
	})
	@ApiQuery({
		name: 'finishDate',
		required: true,
		type: String,
		description: 'End date (ISO 8601). Example: 2026-02-09T23:59:59.999Z'
	})
	@ApiResponse({
		status: 200,
		description: 'Logs deleted successfully'
	})
	@ApiResponse({
		status: 400,
		description: 'Invalid or missing date range'
	})
	deleteBetween(@Query('initDate') initDate: string, @Query('finishDate') finishDate: string) {
		return this.Service.deleteLogBetween(initDate, finishDate);
	}
}
