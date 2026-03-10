import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString, Matches, Min } from 'class-validator';

export class CreatePaymentDto {
  @ApiProperty({ example: '4111111111111111', description: 'Credit card number' })
  @IsString()
  @IsNotEmpty()
  cardNumber!: string;

  @ApiProperty({ example: '12/28', description: 'Expiration date (MM/YY)' })
  @IsString()
  @Matches(/^\d{2}\/\d{2}$/, { message: 'expirationDate must be in MM/YY format' })
  expirationDate!: string;

  @ApiProperty({ example: '123', description: 'Card verification value' })
  @IsString()
  @Matches(/^\d{3,4}$/, { message: 'CVV must be 3 or 4 digits' })
  cvv!: string;

  @ApiProperty({ example: 'John Doe', description: 'Name on the card' })
  @IsString()
  @IsNotEmpty()
  cardholderName!: string;

  @ApiProperty({ example: 150.0, description: 'Payment amount in BRL', minimum: 0.01 })
  @IsNumber()
  @Min(0.01, { message: 'Amount must be greater than zero' })
  amount!: number;
}
