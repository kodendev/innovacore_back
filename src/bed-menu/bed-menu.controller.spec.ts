import { Test, TestingModule } from '@nestjs/testing';
import { BedMenuController } from './bed-menu.controller';
import { BedMenuService } from './bed-menu.service';

describe('BedMenuController', () => {
  let controller: BedMenuController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BedMenuController],
      providers: [BedMenuService],
    }).compile();

    controller = module.get<BedMenuController>(BedMenuController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
