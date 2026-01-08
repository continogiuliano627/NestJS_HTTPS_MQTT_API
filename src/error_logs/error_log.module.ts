import {Module} from '@nestjs/common';
import {ErrorLogsController} from './error_log.controller';
import {ErrorLogsService} from './error_log.service';

@Module({
	providers: [ErrorLogsService],
	controllers: [ErrorLogsController]
})
export class ErrorLogsModule {}
