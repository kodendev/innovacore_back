import { Body, Controller, Get, Post } from "@nestjs/common";
import { MenuService } from "../services/menu.service";
import { CreateMenuDto } from "../dto/create-menu.dto";
import { MenuTypeService } from "../services/menu_type.service";
import { CreateMenuTypesDto } from "../dto/create-menu-types.dto";


@Controller('menu')
export class MenuController {
    constructor(private readonly menuService: MenuService) { }

    @Post()
    create(@Body() createMenuDto: CreateMenuDto) {
        return this.menuService.create(createMenuDto)
    }
    @Get()
    findAll() {
        return 'Testing menu'
    }
}


@Controller('menuType')
export class MenuTypeController {
    constructor(private readonly MenuTypeService: MenuTypeService) { }

    @Post()
    create(@Body() createMenuTypesDto: CreateMenuTypesDto) {
        return this.MenuTypeService.create(createMenuTypesDto)
    }

    @Get()
    findAll() {
        return this.MenuTypeService.findAll()
    }
}