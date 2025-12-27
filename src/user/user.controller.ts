import {
	BadRequestException,
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
import {User} from 'src/database/entities/user.entity';
import {UserRole} from 'src/global/enum';
import {CreateUserDto, UpdateUserDto, UserExample} from './dto/user.dto';
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

	@Get('/getById/:id')
	@ApiOperation({
		summary: 'Get 1 user by ID'
	})
	@ApiParam({
		name: 'id',
		type: 'string',
		required: true
	})
	@ApiResponse({
		status: 200,
		description: 'User found',
		type: User,
		example: UserExample
	})
	getById(@Param('id', new ParseUUIDPipe()) id: string) {
		return this.userService.findById(id);
	}

	@Get('/getByName/')
	@ApiOperation({
		summary: 'Get 1 user by Name'
	})
	@ApiQuery({
		name: 'name',
		type: 'string',
		required: true
	})
	@ApiResponse({
		status: 200,
		description: 'User found',
		type: User,
		example: UserExample
	})
	getByName(@Query('name') name: string) {
		return this.userService.findByName(name);
	}

	@Get('/getByRole/')
	@ApiOperation({
		summary: 'Get users by Role'
	})
	@ApiQuery({
		name: 'role',
		type: 'string',
		required: true,
		examples: {
			1: {
				value: 'admin'
			},
			2: {
				value: 'user'
			},
			3: {
				value: 'other'
			}
		}
	})
	@ApiResponse({
		status: 200,
		description: 'User found',
		type: Array<User>,
		isArray: true,
		example: UserExample
	})
	getByRole(@Query('role') role: UserRole) {
		return this.userService.findByRole(role);
	}

	//PATCH

	@Patch('updateOne/:id/')
	@ApiOperation({
		summary: 'Update one user by his ID'
	})
	@ApiParam({
		name: 'id',
		required: true,
		type: 'string'
	})
	@ApiBody({
		required: true,
		isArray: false,
		examples: {
			1: {
				value: {name: 'ExampleUserName', role: UserRole.ADMIN}
			},
			2: {
				value: {
					name: 'OtherUserName',
					role: UserRole.USER
				}
			}
		},
		type: UpdateUserDto
	})
	@ApiResponse({
		description: 'Updated user with new values',
		example: UserExample
	})
	updateUser(@Param('id', new ParseUUIDPipe()) id: string, @Body() data: UpdateUserDto) {
		if (!data.name?.length && !data.role?.length)
			throw new BadRequestException('New user data must not be empty');
		return this.userService.updateUser(id, data.name, data.role);
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
