import { Request, Response, Router } from "express";
import { ParamsDictionary } from "express-serve-static-core";
import { ParsedQs } from "qs";
import { ICityService } from "./useCase";
interface ICityController {
  getCitiesByPattern(req: Request, res: Response): Promise<void>;
  createCities(req: Request, res: Response): Promise<void>;
  deleteCites(req: Request, res: Response): Promise<void>;
  getAverageCity(req: Request, res: Response): Promise<void>;
  getCityById(req: Request, res: Response): Promise<void>;
}

const router = Router();

export class CityController implements ICityController {
  #CityService: ICityService;

  constructor(CityService: ICityService) {
    this.#CityService = CityService;
    router.post("/cities-search", this.getCitiesByPattern.bind(this));
    router.get("/city/:cityId", this.getCityById.bind(this));
    router.post("/city", this.createCities.bind(this));
    router.delete("/city", this.deleteCites.bind(this));
  }

  async getAverageCity(
    req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>,
    res: Response<any, Record<string, any>>
  ): Promise<void> {
    try {
      const { cityId } = req.body;
      const averageCities = await this.#CityService.getAvergageCities(cityId);
      if (averageCities) {
        res.status(200).json(averageCities);
      }
    } catch (error) {
      if (error instanceof Error) {
        if (error.message == "Impossible to get averageCities") {
          res.status(404).json({ message: error.message });
          return;
        } else {
          res.status(500).json({ message: error.message });
          return;
        }
      }
    }
  }

  async createCities(
    req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>,
    res: Response<any, Record<string, any>>
  ): Promise<void> {
    try {
      const cities = await this.#CityService.createCities();
      if (cities) {
        res.status(200).json(cities);
      }
    } catch (error) {
      if (error instanceof Error) {
        if (error.message == "Impossible to create cities") {
          res.status(404).json({ message: error.message });
          return;
        } else {
          res.status(500).json({ message: error.message });
          return;
        }
      }
    }
  }

  async deleteCites(
    req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>,
    res: Response<any, Record<string, any>>
  ): Promise<void> {
    try {
      const cities = await this.#CityService.deleteCities();
      if (cities) {
        res.status(200).json(cities);
      }
    } catch (error) {
      if (error instanceof Error) {
        if (error.message == "Impossible to delete cities") {
          res.status(404).json({ message: error.message });
          return;
        } else {
          res.status(500).json({ message: error.message });
          return;
        }
      }
    }
  }

  async getCitiesByPattern(req: Request, res: Response): Promise<void> {
    try {
      const { name } = req.body;
      const cities = await this.#CityService.getCitiesByPattern(name);
      if (cities) {
        res.status(200).json(cities);
      }
    } catch (error) {
      if (error instanceof Error) {
        if (error.message == "Impossible to get cities") {
          res.status(404).json({ message: error.message });
          return;
        } else {
          res.status(500).json({ message: error.message });
          return;
        }
      }
    }
  }

  async getCityById(req: Request, res: Response): Promise<void> {
    try {
      const { cityId } = req.params;
      const cities = await this.#CityService.getCityById(cityId);
      if (cities) {
        res.status(200).json(cities);
      }
    } catch (error) {
      if (error instanceof Error) {
        if (error.message == "Cannot to get city") {
          res.status(404).json({ message: error.message });
          return;
        } else {
          res.status(500).json({ message: error.message });
          return;
        }
      }
    }
  }
}

export { router as cityControllerRouter };
