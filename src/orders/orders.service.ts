import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateOrderDto } from './dtos/create-order.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from './order.entity';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
  ) {}

  async findAll() {
    return await this.orderRepository.find();
  }

  async findOne(id: number) {
    const order = await this.orderRepository.findOne({ where: { id } });
    if (!order) {
      throw new NotFoundException('order not found');
    }
    return order;
  }

  async create(createUserDto: CreateOrderDto) {
    const newUser = this.orderRepository.create(createUserDto);
    return await this.orderRepository.save(newUser);
  }

  async update(id: number, attrs: Partial<Order>) {
    const order = await this.findOne(id);
    if (!order) {
      throw new NotFoundException('order not found');
    }
    Object.assign(order, attrs);
    return this.orderRepository.save(order);
  }

  async remove(id: number) {
    const order = await this.orderRepository.findOne({ where: { id } });
    if (!order) {
      throw new NotFoundException('order not found');
    }
    if (order) {
      await this.orderRepository.remove(order);
    }
    return order;
  }
}
