import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, ArrayNotEmpty, ValidateIf, Validate, ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';

@ValidatorConstraint({ name: 'AtLeastOne', async: false })
class AtLeastOneCategoryOrProduct implements ValidatorConstraintInterface {
  validate(_: any, args: ValidationArguments) {
    const obj = args.object as any;
    return (Array.isArray(obj.categoryIds) && obj.categoryIds.length > 0) ||
           (Array.isArray(obj.productIds) && obj.productIds.length > 0);
  }
  defaultMessage(args: ValidationArguments) {
    return 'At least one of categoryIds or productIds must be provided and non-empty.';
  }
}

export class CreateDiscountDto {
  @ApiPropertyOptional()
  discountCode?: string;

  @ApiProperty()
  discountValue: number;

  @ApiPropertyOptional({ type: [Number], description: 'Array of category IDs' })
  @IsArray()
  @ValidateIf((o) => !o.productIds || o.productIds.length === 0)
  @ArrayNotEmpty({ message: 'categoryIds cannot be empty if productIds is not provided.' })
  categoryIds?: number[];

  @ApiPropertyOptional({ type: [Number], description: 'Array of product IDs' })
  @IsArray()
  @ValidateIf((o) => !o.categoryIds || o.categoryIds.length === 0)
  @ArrayNotEmpty({ message: 'productIds cannot be empty if categoryIds is not provided.' })
  productIds?: number[];

  @Validate(AtLeastOneCategoryOrProduct)
  dummy?: any; // just to trigger the class-level validator

  @ApiProperty()
  maximumDiscountUses: number;

  @ApiProperty({ type: [String], description: 'Combination types e.g. product, order, shipping' })
  combination: string[];

  @ApiProperty({ type: Date })
  startDate: Date;

  @ApiProperty({ type: Date })
  endDate: Date;
} 