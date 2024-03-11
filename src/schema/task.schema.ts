import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsNotEmpty } from 'class-validator';
import { now } from 'mongoose';

@Schema()
export class Task {
  @Prop()
  @IsNotEmpty()
  title: string;

  @Prop()
  @IsNotEmpty()
  description: string;

  @Prop()
  @IsNotEmpty()
  status: string; // "OPEN", "IN_PROGRESS", "DONE"

  @Prop({ default: now() })
  createdAt: Date;

  @Prop({ default: now() })
  updatedAt: Date;
}

export const TaskSchema = SchemaFactory.createForClass(Task);
