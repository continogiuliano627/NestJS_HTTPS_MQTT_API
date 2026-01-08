import {Controller, Get, Param, ParseUUIDPipe, Patch, Query} from '@nestjs/common';
import {ApiOperation, ApiParam, ApiQuery, ApiResponse} from '@nestjs/swagger';
import {ErrorLogExample} from './dto/error_log.dto';
import {ErrorLogsService} from './error_log.service';

@Controller('error-logs')
export class ErrorLogsController {
	constructor(private readonly service: ErrorLogsService) {}

	@Get('/all')
	@ApiOperation({
		summary: 'Get all error logs'
	})
	@ApiResponse({
		type: 'Error_log array',
		isArray: true,
		status: 200,
		description: 'Array with all error_logs in database'
	})
	getAll() {
		return this.service.getAll();
	}

	@Get('/table')
	@ApiOperation({
		summary: 'Get all error_logs by giving table'
	})
	@ApiQuery({
		name: 'table',
		type: 'string',
		required: true
	})
	@ApiResponse({
		isArray: true,
		status: 200
	})
	getByTable(@Query('table') table: string) {
		return this.service.getByTable(table);
	}

	@Patch('/setFixed/:id')
	@ApiOperation({
		summary: 'Set an error as fixed'
	})
	@ApiParam({
		name: 'id',
		type: 'string',
		required: true
	})
	@ApiResponse({
		status: 200,
		type: 'Error log',
		example: ErrorLogExample
	})
	setFixed(@Param('id', new ParseUUIDPipe()) id: string) {
		return this.service.setFixed(id);
	}
}
