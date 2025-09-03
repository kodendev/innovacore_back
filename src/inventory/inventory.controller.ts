import { Controller } from '@nestjs/common';
import { InventoryService } from './inventory.service';

@Controller('inventory')
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}

  // @Post()
  // addPurchase(@Body() createInventoryMovementDto: CreateInventoryMovementDto) {
  //   return this.inventoryService.addPurchase(createInventoryMovementDto);
  // }
}
