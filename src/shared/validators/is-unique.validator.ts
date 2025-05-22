import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';
import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';

@ValidatorConstraint({ async: true })
@Injectable()
export class IsUniqueConstraint implements ValidatorConstraintInterface {
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {
    this.validate = this.validate.bind(this);
  }

  validate = async (value: any, args: ValidationArguments): Promise<boolean> => {
    const [EntityClass, property] = args.constraints;
    if (!value) return true;

    const repository = this.dataSource.getRepository(EntityClass);
    const existing = await repository.findOneBy({ [property]: value });

    return !existing;
  }

  defaultMessage(args: ValidationArguments): string {
    const [, property] = args.constraints;
    return `${property} must be unique.`;
  }
}