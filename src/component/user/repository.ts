import { prisma } from "../../db/client";
import { IHasherPassword } from "../../utils/services/passwordHasher";
import { ExistingUser, NewUser } from "./entity";
export interface IUserRepository {
  save(user: NewUser): Promise<ExistingUser>;
  findById(id: string): Promise<ExistingUser | null>;
  findByEmail(email: string): Promise<ExistingUser | null>;
  findAll(): Promise<ExistingUser[]>;
  delete(id: string): Promise<ExistingUser | null>;
}

export class UserRepository implements IUserRepository {
  #HasherPassword: IHasherPassword;
  constructor(HasherPassword: IHasherPassword) {
    this.#HasherPassword = HasherPassword;
  }

  async findAll() {
    const user = await prisma.user.findMany();

    return user;
  }

  async save(user: NewUser): Promise<ExistingUser> {
    const { password, email } = user;
    const hash = await this.#HasherPassword.hash(password);

    const newUser = await prisma.user.create({
      data: {
        email: email,
        password: hash,
      },
    });

    return newUser;
  }

  async findById(id: string) {
    const user = await prisma.user.findUnique({
      where: {
        id: id,
      },
    });

    return user;
  }
  async findByEmail(email: string) {
    const user = await prisma.user.findFirst({
      where: {
        email: email,
      },
    });

    return user;
  }

  async delete(id: string) {
    const user = await prisma.user.delete({
      where: {
        id: id,
      },
    });
    return user;
  }
}
