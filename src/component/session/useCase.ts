import { TSessionEntity } from "./entity";
import { ISessionRepository } from "./repository";

export interface ISessionService {
  getSessionById(id: string): Promise<TSessionEntity>;
  deleteSession(id: string): null | Promise<TSessionEntity>;
}

export class SessionService {
  #SessionRepository: ISessionRepository;
  constructor(SessionRepository: ISessionRepository) {
    this.#SessionRepository = SessionRepository;
  }

  async getSessionById(id: string) {
    return await this.#SessionRepository.getSession(id);
  }

  async deleteSession(id: string) {
    const sessionDeleted = await this.#SessionRepository.deleteSession(id);
    if (sessionDeleted.userId) {
      return sessionDeleted;
    }

    throw new Error("Session Not Found");
  }
}
