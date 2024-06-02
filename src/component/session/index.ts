import { SessionRepository } from "./repository";
import { SessionService } from "./useCase";

const sessionRepository = new SessionRepository();
export const sessionService = new SessionService(sessionRepository);
