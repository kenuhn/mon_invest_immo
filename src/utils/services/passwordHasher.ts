import bcrypt from "bcrypt";

export interface IHasherPassword {
  hash(password: string): Promise<string>;
  compare(reqPassword: string, dataPassword: string): Promise<boolean>;
}

export class HasherPassword implements IHasherPassword {
  async hash(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
  }

  async compare(reqPassword: string, dataPassword: string): Promise<boolean> {
    return bcrypt.compare(reqPassword, dataPassword);
  }
}
