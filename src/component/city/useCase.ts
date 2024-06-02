import { Prisma } from "@prisma/client";
import { IIdGenerator } from "../../utils/services/idGenerator";
import { CitiesApiTypes, CitiesDTO, CitiesGetNameDTO } from "./dto";
import { CitiesEntity, ExistingCity, NewCity } from "./entity";
import { ICityRepository } from "./repository";
export interface ICityService {
  createCities(): Promise<Prisma.BatchPayload>;
  deleteCities(): Promise<Prisma.BatchPayload>;
  getCity(): Promise<ExistingCity[]>;
  getAvergageCities(cityId: string): Promise<number>;
  getCitiesByPattern(pattern: string): Promise<CitiesGetNameDTO[]>;
  getCityById(id: string): Promise<ExistingCity>;
}

export class CityService implements ICityService {
  #cityRepository: ICityRepository;
  #idGenerator: IIdGenerator;

  constructor(cityRepository: ICityRepository, idGenerator: IIdGenerator) {
    this.#cityRepository = cityRepository;
    this.#idGenerator = idGenerator;
  }

  async getCitiesByPattern(pattern: string): Promise<CitiesGetNameDTO[]> {
    const city = await this.#cityRepository.getCitiesByPattern(pattern);
    if (city) {
      return city;
    }
    throw new Error("Impossible to get Cities");
  }

  async createCities(): Promise<Prisma.BatchPayload> {
    const citysApi = await fetch(
      "https://geo.api.gouv.fr/communes?fields=departement"
    );
    const data: CitiesApiTypes[] = await citysApi.json();

    const newData: ExistingCity[] = data.map((citys) => {
      const uid = this.#idGenerator.generate();
      const citysDTO = new CitiesDTO(citys);
      const newCities: NewCity = citysDTO.getCity();
      const cityEntity = new CitiesEntity({ ...newCities, id: uid });

      return cityEntity.getCities();
    });

    const newCities = await this.#cityRepository.pushCities(newData);
    return newCities;
  }

  async getCity() {
    const db = await this.#cityRepository.readCities();
    return db;
  }
  async getAvergageCities(cityId: string): Promise<number> {
    const db = await this.#cityRepository.averageCities(cityId);
    return db;
  }

  async deleteCities() {
    const db = await this.#cityRepository.dropCities();
    return db;
  }

  async getCityById(id: string): Promise<ExistingCity> {
    const city = await this.#cityRepository.readCityById(id);
    return city;
  }
}
