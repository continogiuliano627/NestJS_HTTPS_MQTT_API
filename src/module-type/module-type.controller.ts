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
import {ModuleType} from 'src/database/entities/module-type.entity';
import {
	ModuleTypeCreateBodyDTO,
	ModuleTypeDeleteBodyDTO,
	ModuleTypeExample,
	ModuleTypeUpdateBodyDTO
} from './module-type.dto';
import {ModuleTypeService} from './module-type.service';

@Controller('module-type')
export class ModuleTypeController {
	constructor(private readonly service: ModuleTypeService) {}

	@Get('all')
	@ApiOperation({
		summary: 'Get all module type'
	})
	@ApiResponse({
		type: typeof ModuleType,
		status: 200,
		isArray: true,
		example: [ModuleTypeExample, ModuleTypeExample],
		description: 'Array of all elements found'
	})
	getAll() {
		return this.service.getAll();
	}

	@Get('byId/:id')
	@ApiOperation({
		summary: 'Get one Module type by given ID'
	})
	@ApiParam({
		name: 'id',
		type: 'string',
		required: true
	})
	@ApiResponse({
		description: 'Found element',
		type: typeof ModuleType,
		status: 200,
		isArray: false
	})
	getById(@Param('id', new ParseUUIDPipe()) id: string) {
		return this.service.getById(id);
	}

	@Get('byName')
	@ApiOperation({
		summary: 'Get one Module type by given name'
	})
	@ApiQuery({
		name: 'name',
		required: true,
		type: 'string'
	})
	@ApiResponse({
		status: 200,
		isArray: false,
		type: typeof ModuleType,
		description: 'Found element'
	})
	getByName(@Query('name') name: string) {
		return this.service.getByName(name);
	}

	@Patch('update')
	@ApiOperation({
		summary: 'Update a ModuleType name'
	})
	@ApiBody({
		type: typeof ModuleTypeUpdateBodyDTO,
		required: true,
		examples: {
			1: {
				value: {
					id: ModuleTypeExample.id,
					name: ModuleTypeExample.name
				}
			}
		}
	})
	@ApiResponse({
		status: 201,
		description: 'Updated ModuleType',
		example: ModuleTypeExample
	})
	updateOne(@Body() data: ModuleTypeUpdateBodyDTO) {
		return this.service.updateOne(data.id, data.name);
	}

	@Post('create')
	@ApiOperation({
		summary: 'Create a new ModuleType'
	})
	@ApiBody({
		required: true,
		isArray: false,
		examples: {
			1: {
				value: {
					name: 'LM35'
				}
			}
		}
	})
	@ApiResponse({
		status: 201,
		description: 'New ModuleType created',
		example: ModuleTypeExample
	})
	createOne(@Body() data: ModuleTypeCreateBodyDTO) {
		return this.service.createOne(data.name);
	}

	@Patch('restore')
	@ApiOperation({
		summary: 'Restore an eliminated ModuleType by given ID'
	})
	@ApiBody({
		required: true,
		isArray: false,
		type: typeof ModuleTypeDeleteBodyDTO,
		examples: {
			1: {
				value: {id: ModuleTypeExample.id}
			}
		}
	})
	@ApiResponse({
		status: 201,
		description: 'Restored element',
		example: ModuleTypeExample,
		type: typeof ModuleTypeExample
	})
	restoreOne(@Body() data: ModuleTypeDeleteBodyDTO) {
		return this.service.restoreOne(data.id);
	}

	@Delete('delete')
	@ApiOperation({
		summary: 'Delete 1 ModuleType by given ID'
	})
	@ApiBody({
		required: true,
		description: 'Body with target element id',
		type: typeof ModuleTypeDeleteBodyDTO,
		examples: {
			1: {
				value: {
					id: ModuleTypeExample.id
				}
			}
		}
	})
	@ApiResponse({
		status: 201,
		example: {
			...ModuleTypeExample,
			isDeleted: true
		},
		description: 'Target element with deleted prop in true'
	})
	deleteOne(@Body() data: ModuleTypeDeleteBodyDTO) {
		return this.service.deleteOne(data.id);
	}
}
