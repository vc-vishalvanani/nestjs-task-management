import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsNotEmpty } from 'class-validator';

@Schema({ timestamps: true })
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
}

export const TaskSchema = SchemaFactory.createForClass(Task);
