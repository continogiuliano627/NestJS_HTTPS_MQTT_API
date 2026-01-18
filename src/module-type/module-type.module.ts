import {Module} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import {ModuleType} from 'src/database/entities/module-type.entity';
import {ModuleTypeController} from './module-type.controller';
import {ModuleTypeService} from './module-type.service';

@Module({
	imports: [TypeOrmModule.forFeature([ModuleType])],
	providers: [ModuleTypeService],
	controllers: [ModuleTypeController]
})
export class ModuleTypeModule {}
