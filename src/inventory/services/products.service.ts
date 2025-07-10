import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from '../entities/products.entity';
import { CreateProductDto } from 'src/inventory/dto/create-product.dto';
import { UpdateProductDto } from '../dto/update-product.dto';

@Injectable()
export class ProductService {
    private readonly logger = new Logger(ProductService.name);

    constructor(
        @InjectRepository(Product)
        private readonly productRepository: Repository<Product>,
    ) { }

    async create(createProductDto: CreateProductDto) {
        this.logger.log(`Creating product: ${JSON.stringify(createProductDto)}`);
        const product = this.productRepository.create(createProductDto);
        return await this.productRepository.save(product);
    }

    async findAll() {
        this.logger.log('Fetching all products');
        return await this.productRepository.find();
    }

    async findOne(id: number) {
        this.logger.log(`Fetching product with id: ${id}`);
        const product = await this.productRepository.findOneBy({ id });
        if (!product) {
            throw new NotFoundException(`Product with id ${id} not found`);
        }
        return product;
    }

    async update(id: number, updateProductDto: UpdateProductDto) {
        this.logger.log(`Updating product id ${id}: ${JSON.stringify(updateProductDto)}`);
        const product = await this.productRepository.preload({
            id,
            ...updateProductDto,
        });
        if (!product) {
            throw new NotFoundException(`Product with id ${id} not found`);
        }
        return await this.productRepository.save(product);
    }

    async remove(id: number) {
        this.logger.log(`Removing product with id: ${id}`);
        const product = await this.productRepository.findOneBy({ id });
        if (!product) {
            throw new NotFoundException(`Product with id ${id} not found`);
        }
        await this.productRepository.remove(product);
        return { message: `Product with id ${id} deleted successfully` };
    }
}
