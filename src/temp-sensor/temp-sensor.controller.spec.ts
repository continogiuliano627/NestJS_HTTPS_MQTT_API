import { Test, TestingModule } from '@nestjs/testing';
import { TempSensorController } from './temp-sensor.controller';

describe('TempSensorController', () => {
  let controller: TempSensorController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TempSensorController],
    }).compile();

    controller = module.get<TempSensorController>(TempSensorController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
