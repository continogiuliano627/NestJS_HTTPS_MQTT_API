import {Module} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import {ErrorLog} from 'src/database/entities/error-log.entity';
import {ErrorLogsController} from './error_log.controller';
import {ErrorLogsService} from './error_log.service';

@Module({
	imports: [TypeOrmModule.forFeature([ErrorLog])],
	providers: [ErrorLogsService],
	controllers: [ErrorLogsController]
})
export class ErrorLogsModule {}
