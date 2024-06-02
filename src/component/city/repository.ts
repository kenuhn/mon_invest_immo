import { Prisma } from "@prisma/client";
import { prisma } from "../../db/client";
import { ExistingPost } from "../post/entity";
import { CitiesGetNameDTO } from "./dto";
import { ExistingCity } from "./entity";
export interface ICityRepository {
  pushCities(citysList: ExistingCity[]): Promise<Prisma.BatchPayload>;
  dropCities(): Promise<Prisma.BatchPayload>;
  readCities(): Promise<ExistingCity[]>;
  getCitiesByPattern(pattern: string): Promise<CitiesGetNameDTO[]>;
  averageCities(cityId: string): Promise<number>;
  readCityById(cityId: string): Promise<ExistingCity>;
}

export class CityRepository implements ICityRepository {
  async averageCities(cityId: string) {
    const posts: ExistingPost[] = await prisma.post.findMany({
      where: {
        cityId: cityId,
      },
      include: {
        ratings: true,
        comments: true,
      },
    });
    if (posts) {
      const validatePost = posts.map((post) => {
        if (post.ratings?.moyenne) {
          return post.ratings.moyenne;
        }
        return 0;
      });

      const sum = validatePost.reduce((acc, curr) => {
        return acc + curr;
      });

      const moyenne = sum / validatePost.length;

      prisma.city.update({
        where: {
          id: cityId,
        },
        data: {
          moyenne: moyenne,
        },
      });
      return moyenne;
    }
    throw new Error("Impossible to get average");
  }

  async readCities(): Promise<ExistingCity[]> {
    const allCity = await prisma.city.findMany();
    if (allCity) {
      return allCity;
    }
    throw new Error("Method not implemented.");
  }

  async pushCities(citysList: ExistingCity[]): Promise<Prisma.BatchPayload> {
    console.log(citysList);
    const db = await prisma.city.createMany({ data: citysList });
    if (db) {
      return db;
    }

    throw new Error("Impossible to Push Cities");
  }

  async dropCities(): Promise<Prisma.BatchPayload> {
    const db = await prisma.city.deleteMany({});
    if (db) {
      return db;
    }

    throw new Error("Impossible to Drop Cities");
  }

  async getCitiesByPattern(pattern: string): Promise<CitiesGetNameDTO[]> {
    const cities: CitiesGetNameDTO[] = await prisma.city.findMany({
      where: {
        name: {
          startsWith: pattern,
        },
      },
      select: {
        name: true,
        id: true,
      },
    });

    if (cities.length > 0) {
      return cities;
    }

    throw new Error("Impossible to get Cities");
  }

  async readCityById(cityId: string): Promise<ExistingCity> {
    const city = await prisma.city.findUnique({
      where: {
        id: cityId,
      },
      include: {
        post: true,
      },
    });

    if (city) {
      return city;
    }

    throw new Error("Cannot get City");
  }
}
