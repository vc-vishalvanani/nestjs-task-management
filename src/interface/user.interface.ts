export interface IUser extends Document {
  readonly id: string;
  readonly name: string;
  readonly userName: string;
  readonly password: string;
}
