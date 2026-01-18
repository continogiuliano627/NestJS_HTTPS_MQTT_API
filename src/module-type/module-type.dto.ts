import type {ModuleType} from 'src/database/entities/module-type.entity';

export const ModuleTypeExample: ModuleType = {
	id: 'b763fe12-dc19-46f6-a477-2776003c6c43',
	name: 'LM35',
	isDeleted: false
};

export class ModuleTypeUpdateBodyDTO {
	id: string;
	name: string;
}

export class ModuleTypeCreateBodyDTO {
	name: string;
}

export class ModuleTypeDeleteBodyDTO {
	id: string;
}
