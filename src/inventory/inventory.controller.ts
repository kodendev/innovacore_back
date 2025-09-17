import { Controller, Get } from '@nestjs/common';
import { InventoryService } from './inventory.service';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('Inventory')
@Controller('inventory')
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}

  @Get('movements')
  @ApiOperation({ summary: 'Obtener historial de movimientos de inventario' })
  findAll() {
    return this.inventoryService.findAll();
  }
}
