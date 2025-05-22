import { registerDecorator, ValidationOptions, ValidationArguments } from 'class-validator';
import { getRepository } from 'typeorm';

export function IsUnique(
  entity: Function,
  property: string,
  validationOptions?: ValidationOptions,
  exceptionCallback?: (dto: any) => any,
) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isUnique',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [entity, property, exceptionCallback],
      validator: {
        async validate(value: any, args: ValidationArguments) {
          const [entity, property, exceptionCallback] = args.constraints;
          const repository = getRepository(entity);
          const exceptionValue = exceptionCallback ? exceptionCallback(args.object) : null;

          const query = repository.createQueryBuilder('entity')
            .where(`entity.${property} = :value`, { value });

          if (exceptionValue) {
            query.andWhere(`entity.id != :exceptionValue`, { exceptionValue });
          }

          const count = await query.getCount();
          return count === 0;
        },
      },
    });
  };
}
