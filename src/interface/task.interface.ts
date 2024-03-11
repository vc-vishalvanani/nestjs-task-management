export interface ITask extends Document {
  readonly id: number;
  readonly title: string;
  readonly description: string;
  readonly status: string;
}
