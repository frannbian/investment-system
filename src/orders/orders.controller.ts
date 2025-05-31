import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Body,
  ParseIntPipe,
  HttpException,
  HttpStatus,
  Inject,
} from '@nestjs/common';
import { CreateOrderDto } from './dtos/create-order.dto';
import { OrdersService } from './orders.service';
import { ClientKafka, ClientProxy, MessagePattern } from '@nestjs/microservices';

@Controller('orders')
export class OrdersController {
  constructor(
    private readonly ordersService: OrdersService,
    @Inject('KAFKA_SERVICE') private readonly kafkaClient: ClientProxy
  ) {}

  @Get()
  async findAll() {
    try {
      return await this.ordersService.findAll();
    } catch (error) {
      throw new HttpException(
        'Failed to fetch orders',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    try {
      const order = await this.ordersService.findOne(id);
      if (!order) {
        throw new HttpException('Order not found', HttpStatus.NOT_FOUND);
      }
      return order;
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to fetch order',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post()
  async create(@Body() createOrderDto: CreateOrderDto) {
    try {
      const order = await this.ordersService.create(createOrderDto);

      if (order) {
        this.kafkaClient.emit('order-created', createOrderDto);
      }

      return order;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Post(':id/cancel')
  async cancelOrder(@Param('id', ParseIntPipe) id: number) {
    try {
      return await this.ordersService.cancelOrder(id);
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to cancel order',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    try {
      const result = await this.ordersService.remove(id);
      if (!result) {
        throw new HttpException('Order not found', HttpStatus.NOT_FOUND);
      }
      return { message: 'Order deleted successfully' };
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to delete order',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @MessagePattern('order-created')
  handleOrderCreated(data: CreateOrderDto) {
    try {
      console.log('Order created event received:', data);
    } catch (error) {
      console.error('Error handling order created event:', error);
      throw new HttpException(
        'Failed to process order created event',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
