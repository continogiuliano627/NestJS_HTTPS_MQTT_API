import { Test, TestingModule } from '@nestjs/testing';
import { TempSensorService } from './temp-sensor.service';

describe('TempSensorService', () => {
  let service: TempSensorService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TempSensorService],
    }).compile();

    service = module.get<TempSensorService>(TempSensorService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
