import {Body, Controller, Post} from '@nestjs/common';
import {CreateTempSensorDto} from './dto/create-temp-sensor.dto';
import {TempSensorService} from './temp-sensor.service';

@Controller('temp-sensor')
export class TempSensorController {
	constructor(private readonly tempSensorService: TempSensorService) {}

	@Post('/create')
	createOne(@Body() data: CreateTempSensorDto) {
		return this.tempSensorService.createOne(data);
	}
}
