import { IdGenerator } from "../../utils/services/idGenerator";
import { HasherPassword } from "../../utils/services/passwordHasher";
import { SessionRepository } from "../session/repository";
import { UserRepository } from "./repository";
import { UserService } from "./useCase";

/* adaptateur */

const hasherPassword = new HasherPassword();
const idGenerator = new IdGenerator();
/* repository */

const userRepository = new UserRepository(hasherPassword);
const sessionRepository = new SessionRepository();

/* === DOMAIN  ==== */
export const userService = new UserService(
  userRepository,
  idGenerator,
  sessionRepository,
  hasherPassword
);
