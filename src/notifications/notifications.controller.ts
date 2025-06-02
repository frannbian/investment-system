import { Controller, HttpException, HttpStatus } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';

@Controller('notifications')
export class NotificationsController {
  constructor() {}

  @MessagePattern('order-created')
  sendNotificationToUser(@Payload() data: any) {
    try {
      console.log(
        'Sending notification to user with order created information:',
        data,
      );
    } catch (error) {
      console.error('Error handling order created event:', error);
      throw new HttpException(
        'Failed to process order created event',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
