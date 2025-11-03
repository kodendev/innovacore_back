import { Test, TestingModule } from '@nestjs/testing';
import { BedMenuService } from './bed-menu.service';

describe('BedMenuService', () => {
  let service: BedMenuService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BedMenuService],
    }).compile();

    service = module.get<BedMenuService>(BedMenuService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
