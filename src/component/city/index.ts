import { IdGenerator } from "../../utils/services/idGenerator";
import { CityRepository } from "./repository";
import { CityService } from "./useCase";
const cityRepository = new CityRepository();

const idGenerator = new IdGenerator();
export const cityService = new CityService(cityRepository, idGenerator);
