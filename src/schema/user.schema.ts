import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsNotEmpty } from 'class-validator';

@Schema({ timestamps: true })
export class User {
  @Prop()
  @IsNotEmpty()
  username: string;

  @Prop({ select: false })
  @IsNotEmpty()
  password: string;

  @Prop()
  @IsNotEmpty()
  name: string;

  @Prop()
  @IsNotEmpty()
  status: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
