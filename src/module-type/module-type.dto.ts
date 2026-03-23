import type {ModuleType} from 'src/database/entities/module-type.entity';
import type {ModuleKind} from 'src/global/enum';

export const ModuleTypeExample: ModuleType = {
	id: 'b763fe12-dc19-46f6-a477-2776003c6c43',
	name: 'LM35',
	isDeleted: false,
	kind: 'READ'
};

export class ModuleTypeUpdateBodyDTO {
	id: string;
	name: string;
	kind: ModuleKind;
}

export class ModuleTypeCreateBodyDTO {
	name: string;
	kind: ModuleKind;
}

export class ModuleTypeDeleteBodyDTO {
	id: string;
}
