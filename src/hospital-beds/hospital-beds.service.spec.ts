import { Test, TestingModule } from '@nestjs/testing';
import { HospitalBedsService } from './hospital-beds.service';

describe('HospitalBedsService', () => {
  let service: HospitalBedsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HospitalBedsService],
    }).compile();

    service = module.get<HospitalBedsService>(HospitalBedsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
