import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaService } from 'src/prisma.service';
import { PaginationDto } from 'src/common';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  async create(createProductDto: CreateProductDto) {
    const productCreated = await this.prisma.product.create({
      data: createProductDto,
    });

    return productCreated;
  }

  async findAll(paginationDto: PaginationDto) {
    const { offset, limit } = paginationDto;

    const totalProducts = await this.prisma.product.count({
      where: { available: true },
    });

    const products = await this.prisma.product.findMany({
      skip: (offset - 1) * limit,
      take: limit,
      where: { available: true },
    });

    return {
      total: totalProducts,
      results: products,
      page: offset,
      lastPage: Math.ceil(totalProducts / limit),
    };
  }

  async findOne(id: number) {
    const product = await this.prisma.product.findFirst({
      where: { id, available: true },
    });

    if (!product) {
      throw new RpcException({
        message: `Product with ID ${id} not found`,
        status: 404,
      });
    }

    return product;
  }

  async update(updateProductDto: UpdateProductDto) {
    const { id, ...data } = updateProductDto;

    await this.findOne(id);

    const updatedProduct = await this.prisma.product.update({
      where: { id, available: true },
      data,
    });

    return updatedProduct;
  }

  async remove(id: number) {
    await this.findOne(id);

    await this.prisma.product.update({
      where: { id },
      data: { available: false },
    });

    return { message: `Product with ID ${id} has been removed.` };
  }
}
