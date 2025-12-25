import {type UserRole} from 'src/global/enum';

export type CreateUserDto = {
	name: string;
	role: UserRole;
};
