import {Body, Controller, Delete, Get, Param, ParseUUIDPipe, Patch, Post} from '@nestjs/common';
import {ApiBody, ApiOperation, ApiParam, ApiResponse} from '@nestjs/swagger';
import {
	CreateDeviceModuleDTO,
	Device_ModuleDTO,
	DeviceModuleExample,
	UpdateDeviceModuleDTO
} from './device-module.dto';
import {DeviceModuleService} from './device-module.service';

@Controller('device-module')
export class DeviceModuleController {
	constructor(private readonly service: DeviceModuleService) {}

	@Get('all')
	@ApiOperation({
		summary: 'Get all Device_module'
	})
	@ApiResponse({
		isArray: true,
		status: 200,
		example: [DeviceModuleExample, DeviceModuleExample]
	})
	getAll(): Promise<Device_ModuleDTO[]> {
		return this.service.getAll();
	}

	@Get('device/:id')
	@ApiOperation({
		summary: 'Get a list of device_module based on device ID'
	})
	@ApiParam({
		name: 'id',
		required: true,
		description: 'ID of the target device',
		example: DeviceModuleExample.deviceId
	})
	@ApiResponse({
		description: 'Array with the found elements',
		status: 200,
		example: [DeviceModuleExample, DeviceModuleExample],
		isArray: true
	})
	getByDevice(@Param('id') id: string) {
		return this.service.getByDevice(id);
	}

	@Get('type/:id')
	@ApiOperation({
		summary: 'Get a list of device_module based on ModuleType ID'
	})
	@ApiParam({
		name: 'id',
		required: true,
		description: 'ID of the target ModuleType',
		example: DeviceModuleExample.typeId
	})
	@ApiResponse({
		description: 'Array with the found elements',
		status: 200,
		example: [DeviceModuleExample, DeviceModuleExample],
		isArray: true
	})
	getByType(@Param('id', new ParseUUIDPipe()) id: string) {
		return this.service.getByType(id);
	}
	@Get('element/:id')
	@ApiOperation({
		summary: 'Get a device info based on the element id'
	})
	@ApiParam({
		name: 'id',
		required: true,
		description: 'ID of the target ModuleType',
		example: DeviceModuleExample.typeId
	})
	@ApiResponse({
		description: 'Array with the found elements',
		status: 200,
		example: [DeviceModuleExample, DeviceModuleExample],
		isArray: false
	})
	getById(@Param('id', new ParseUUIDPipe()) id: string) {
		return this.service.getById(id);
	}

	@Post('create')
	@ApiOperation({
		summary: 'Create a new Device_module'
	})
	@ApiBody({
		required: true,
		description: 'Data for the new element',
		examples: {
			1: {
				value: {
					name: 'Sensor de temperatura',
					typeId: '2e209e85-b64e-47ec-9228-551ab612e1da',
					deviceId: 'CC:50:E3:47:D1:DF'
				}
			}
		}
	})
	@ApiResponse({
		status: 201,
		example: DeviceModuleExample,
		description: 'Created element'
	})
	createOne(@Body() data: CreateDeviceModuleDTO) {
		return this.service.create(data);
	}

	@Patch('update/:id')
	@ApiOperation({
		summary: 'Update a Device_module name or typeId'
	})
	@ApiParam({
		name: 'id',
		required: true,
		example: DeviceModuleExample.id,
		description: 'Id of the target element'
	})
	@ApiBody({
		description: 'JSON with the new data',
		required: true,
		examples: {
			1: {
				value: {
					name: 'New_Name',
					typeId: '0290acfa-ec9c-40dc-8e46-123d703c156e'
				}
			}
		}
	})
	@ApiResponse({
		status: 201,
		example: DeviceModuleExample,
		description: 'Updated element'
	})
	updateOne(@Param('id', new ParseUUIDPipe()) id: string, @Body() data: UpdateDeviceModuleDTO) {
		return this.service.updateOne(id, data);
	}

	@Delete('delete/:id')
	@ApiOperation({
		summary: 'Deletes an element'
	})
	@ApiParam({
		name: 'id',
		required: true,
		example: '0290acfa-ec9c-40dc-8e46-123d703c156e'
	})
	@ApiResponse({
		status: 201,
		description: 'Boolean validation message'
	})
	deleteOne(@Param('id', new ParseUUIDPipe()) id: string) {
		return this.service.deleteOne(id);
	}
}
