import { randomUUID } from "crypto";

export interface IIdGenerator {
  generate(): string;
}

export class IdGenerator implements IIdGenerator {
  generate(): string {
    return randomUUID();
  }
}
