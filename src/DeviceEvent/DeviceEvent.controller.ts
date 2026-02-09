import {Controller, Delete, Query} from '@nestjs/common';
import {ApiOperation, ApiQuery, ApiResponse} from '@nestjs/swagger';
import {DeviceEventService} from './DeviceEvent.service';

@Controller()
export class DeviceEventController {
	constructor(private readonly Service: DeviceEventService) {}

	@Delete('delete')
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
