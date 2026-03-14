import { IsString, IsNotEmpty, Length } from 'class-validator';

export class CreateSessionFromQrDto {
  @IsString()
  @IsNotEmpty({ message: 'QR code is required' })
  @Length(1, 128, { message: 'QR code must be between 1 and 128 characters' })
  code: string;
}
