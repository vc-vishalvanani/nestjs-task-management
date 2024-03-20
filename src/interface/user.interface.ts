export interface IUser extends Document {
  readonly id: string;
  readonly name: string;
  readonly userName: string;
  password: string;
}
