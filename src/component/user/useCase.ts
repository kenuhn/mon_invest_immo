import { IIdGenerator } from "../../utils/services/idGenerator";
import { IHasherPassword } from "../../utils/services/passwordHasher";
import { SessionEntity, TSessionEntity } from "../session/entity";
import { ISessionRepository } from "../session/repository";
import { ExistingUser, NewUser, UserEntity } from "./entity";
import { IUserRepository } from "./repository";

export interface IUserService {
  create(reqUser: NewUser): Promise<ExistingUser>;
  readAll(): Promise<ExistingUser[]>;
  readbyId(id: string): Promise<ExistingUser | null>;
  readbyEmail(email: string): Promise<ExistingUser>;
  login(userDb: NewUser, reqPassword: string): Promise<TSessionEntity>;

  deleteUser(id: string): Promise<ExistingUser | null>;
}

export class UserService implements IUserService {
  #UserRepository: IUserRepository;
  #SessionRepository: ISessionRepository;
  #IdGenerator: IIdGenerator;
  #HasherPassword: IHasherPassword;

  constructor(
    UserRepository: IUserRepository,
    IdGenerator: IIdGenerator,
    SessionRepository: ISessionRepository,
    HasherPassword: IHasherPassword
  ) {
    this.#UserRepository = UserRepository;
    this.#IdGenerator = IdGenerator;
    this.#SessionRepository = SessionRepository;
    this.#HasherPassword = HasherPassword;
  }
  async readAll(): Promise<ExistingUser[]> {
    try {
      const allUsers = this.#UserRepository.findAll();
      return allUsers;
    } catch (error) {
      throw error;
    }
  }

  async create(reqUser: NewUser) {
    try {
      console.log(reqUser);
      const { email, password } = reqUser;
      const userFound = await this.readbyEmail(email);
      if (userFound) {
        throw new Error("Account already exist");
      }
      const userId = this.#IdGenerator.generate();
      console.log("entity", userId);
      const user = new UserEntity(userId, email, password);

      const newUser = await this.#UserRepository.save(user);
      return newUser;
    } catch (error) {
      throw error;
    }
  }

  async readbyId(id: string) {
    const user = await this.#UserRepository.findById(id);
    return user;
  }

  async readbyEmail(email: string) {
    const user = await this.#UserRepository.findByEmail(email);
    if (user) {
      return user;
    }
    throw new Error("User not Found");
  }

  async login(
    userDb: ExistingUser,
    reqPassword: string
  ): Promise<TSessionEntity> {
    const { id, password } = userDb;
    const isSamePassword = await this.#HasherPassword.compare(
      reqPassword,
      password
    );

    if (isSamePassword) {
      const sessionId = this.#IdGenerator.generate();
      const session = new SessionEntity({ id: sessionId, userId: id });
      const newSession = await this.#SessionRepository.saveSession(
        session.getSession()
      );

      return newSession;
    }
    throw new Error("Not Same Password");
  }

  async deleteUser(id: string) {
    const userDeleted = await this.#UserRepository.delete(id);
    if (userDeleted) {
      return userDeleted;
    }
    throw new Error("User not Found");
  }
}
