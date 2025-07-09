import { Test, TestingModule } from '@nestjs/testing';
import { HospitalBedsController } from './hospital-beds.controller';
import { HospitalBedsService } from './hospital-beds.service';

describe('HospitalBedsController', () => {
  let controller: HospitalBedsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HospitalBedsController],
      providers: [HospitalBedsService],
    }).compile();

    controller = module.get<HospitalBedsController>(HospitalBedsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
