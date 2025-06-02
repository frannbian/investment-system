import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IsUniqueConstraint } from './validators/is-unique.validator';

@Module({
  imports: [TypeOrmModule.forFeature([])],
  providers: [IsUniqueConstraint],
  exports: [IsUniqueConstraint],
})
export class SharedModule {}
