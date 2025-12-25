import {Body, Controller, Delete, Get, Param, ParseUUIDPipe, Post} from '@nestjs/common';
import {ApiBody, ApiOperation, ApiParam, ApiResponse} from '@nestjs/swagger';
import {CreateUserDto} from './dto/user.dto';
import {UserService} from './user.service';

@Controller('user')
export class UserController {
	constructor(private readonly userService: UserService) {}

	// GETS
	@Get('/getAll')
	@ApiOperation({
		summary: 'Get all users'
	})
	@ApiResponse({
		description: 'Users array',
		status: 200,
		example: {
			id: 'uuid',
			name: 'UserName',
			role: 'admin',
			createdAt: '1997-12-22T12:13:00Z',
			updatedAt: '2025-12-22T00:00:00Z'
		}
	})
	getAll() {
		return this.userService.getAll();
	}

	//POSTS
	@Post('/createOne')
	@ApiOperation({
		summary: 'Create an user'
	})
	@ApiBody({
		isArray: false,
		required: true,
		examples: {
			1: {
				value: {
					name: 'Usuario',
					role: 'admin'
				}
			},
			2: {
				value: {
					name: 'Usuario_2',
					role: 'user'
				}
			}
		}
	})
	createOne(@Body() data: CreateUserDto) {
		return this.userService.create(data.name, data.role);
	}

	@Delete('/delete/:id')
	@ApiOperation({
		summary: 'Delete user by id'
	})
	@ApiParam({
		name: 'id',
		required: true,
		type: 'string'
	})
	@ApiResponse({
		status: 200
	})
	deleteOne(@Param('id', new ParseUUIDPipe()) id: string) {
		return this.userService.deleteOne(id);
	}
}
