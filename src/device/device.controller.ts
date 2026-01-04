import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	ParseUUIDPipe,
	Patch,
	Post,
	Query
} from '@nestjs/common';
import {ApiBody, ApiOperation, ApiParam, ApiQuery, ApiResponse} from '@nestjs/swagger';
import {DeviceDeleteDTO, DeviceExample, DeviceUpdateDTO} from './device.dto';
import {DeviceService} from './device.service';

@Controller('device')
export class DeviceController {
	constructor(private readonly deviceService: DeviceService) {}

	@Get('/all')
	@ApiOperation({
		summary: 'Get all devices'
	})
	@ApiResponse({
		isArray: true,
		status: 200,
		description: 'Array of found devices'
	})
	getAll() {
		return this.deviceService.findAll();
	}

	@Get('/deleted')
	@ApiOperation({
		summary: 'Get all deleted devices'
	})
	@ApiResponse({
		isArray: true,
		status: 200,
		description: 'Array of found logically deleted devices'
	})
	getDeleted() {
		return this.deviceService.findDeleted();
	}

	@Get('/id/:id')
	@ApiOperation({
		summary: 'Get one device by the provided ID'
	})
	@ApiParam({
		name: 'id',
		type: 'string',
		required: true,
		description: 'Target element ID'
	})
	@ApiResponse({
		description: 'Found device or 404 exception',
		example: DeviceExample,
		isArray: false
	})
	getById(@Param('id', new ParseUUIDPipe()) id: string) {
		return this.deviceService.findById(id);
	}

	@Get('/name/')
	@ApiOperation({
		summary: 'Get one device by the provided name'
	})
	@ApiQuery({
		name: 'name',
		type: 'string',
		required: true,
		description: 'Target element name'
	})
	@ApiResponse({
		description: 'Found device or 404 exception',
		example: DeviceExample,
		isArray: false
	})
	getByName(@Query('name') name: string) {
		return this.deviceService.findByName(name);
	}

	@Post('/create')
	@ApiOperation({
		summary: 'Create a new device'
	})
	@ApiBody({
		isArray: false,
		description: 'JSON with the desired name',
		examples: {
			1: {
				value: {name: 'Modulo Luces Entrada patio'}
			}
		}
	})
	@ApiResponse({
		type: 'Device',
		description: 'Created device',
		example: DeviceExample,
		isArray: false
	})
	createOne(name: string) {
		return this.deviceService.createOne(name);
	}

	@Patch('/update')
	@ApiOperation({
		summary: 'Target device with desired new name'
	})
	@ApiBody({
		required: true,
		description: 'JSON with target value and new name',
		examples: {
			1: {
				value: {
					id: DeviceExample.id,
					name: 'Modulo bomba de carga'
				}
			}
		},
		isArray: false
	})
	@ApiResponse({
		description: 'Device with updated data',
		example: {
			...DeviceExample,
			name: 'Modulo bomba de carga'
		},
		status: 201
	})
	updateOne(@Body() data: DeviceUpdateDTO) {
		return this.deviceService.updateOne(data);
	}

	@Delete('/delete')
	@ApiOperation({
		summary: 'Delete a device by id'
	})
	@ApiBody({
		isArray: false,
		required: true,
		description: 'Data to target and delete ID',
		examples: {
			'Logical delete': {
				value: {
					id: DeviceExample.id,
					force: false
				},
				description: 'Makes a logical delete'
			},
			'Permanent delete entry': {
				value: {
					id: DeviceExample.id,
					force: true
				},
				description: 'Makes a permanent delete from database'
			}
		}
	})
	@ApiResponse({
		description: 'Delete confirmation',
		status: 204,
		example: true
	})
	deleteOne(data: DeviceDeleteDTO) {
		return this.deviceService.deleteOne(data);
	}
}
