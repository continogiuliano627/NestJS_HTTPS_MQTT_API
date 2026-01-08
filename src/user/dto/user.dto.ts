import {IsBoolean, IsEnum, IsOptional, IsString} from 'class-validator';
import {UserRole} from 'src/global/enum';

export const UserExample = {
	id: 'abcd1234-56ef-89gh-10ij-klmn1112opqr1314',
	name: 'Username',
	role: 'user',
	isDeleted: false,
	createdAt: '1997-22-12T12:13:00Z',
	updatedAt: '2025-22-12T12:13:00Z'
};

export class CreateUserDto {
	@IsString()
	name: string;
	@IsEnum(UserRole)
	role: UserRole;
}

export class UpdateUserDto {
	@IsString()
	@IsOptional()
	name?: string;
	@IsString()
	@IsOptional()
	@IsEnum(UserRole)
	role?: UserRole;
	@IsBoolean()
	@IsOptional()
	isDeleted?: boolean;
}
