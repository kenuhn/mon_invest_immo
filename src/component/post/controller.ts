import { Request, Response, Router } from "express";
import { ParamsDictionary } from "express-serve-static-core";
import { ParsedQs } from "qs";
import { ICityService } from "../city/useCase";
import { ExistingPost, NewPost } from "./entity";
import { IPostsUseCase } from "./useCase";
interface IController {
  getPost(req: Request, res: Response): void;
  getPostByCity(req: Request, res: Response): Promise<void>;
  create(req: Request, res: Response): Promise<void>;
  update(req: Request, res: Response): Promise<void | null>;
  delete(req: Request, res: Response): Promise<void>;
}

const router = Router();

export class PostController implements IController {
  #PostUseCase: IPostsUseCase;
  #CityService: ICityService;
  constructor(PostUseCase: IPostsUseCase, CityService: ICityService) {
    this.#PostUseCase = PostUseCase;
    this.#CityService = CityService;
    router.get("/post", this.getPost.bind(this));
    router.get("/post/:city", this.getPostByCity.bind(this));
    router.post("/create-post/", this.create.bind(this));
    router.put("/post-update/", this.update.bind(this));
    router.delete("/post-delete", this.delete.bind(this));
  }
  async getPostByCity(
    req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>,
    res: Response<any, Record<string, any>>
  ): Promise<void> {
    try {
      const { city } = req.params;
      const allPost = await this.#PostUseCase.readByCity(city);
      res.status(200).json(allPost);
      return;
    } catch (error) {
      if (error instanceof Error) {
        if (error.message == "Impossible to get List") {
          res.status(404).json({ message: error.message });
          return;
        } else {
          res.status(500).json({ message: error.message });
          return;
        }
      }
    }
  }
  async create(
    req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>,
    res: Response<any, Record<string, any>>
  ): Promise<void> {
    try {
      const { ...InputPost }: NewPost = req.body;
      // reflection sur les décorateurs
      this.#PostUseCase.addObserver("create", async () => {
        const averageCity = await this.#CityService.getAvergageCities(
          InputPost.cityId
        );
        return averageCity;
      });
      const post: ExistingPost = await this.#PostUseCase.create(InputPost);

      if (post) {
        res.status(200).json({ post });
      }

      return;
    } catch (error) {
      if (error instanceof Error) {
        if (error.message == "Impossible to create post") {
          res.status(404).json({ message: error.message });
          return;
        } else {
          res.status(500).json({ message: error.message });
          return;
        }
      }
    }
  }
  async update(
    req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>,
    res: Response<any, Record<string, any>>
  ): Promise<void> {
    try {
      const { ...InputPost }: NewPost = req.body;
      this.#PostUseCase.addObserver("create", async () => {
        // reflection sur les décorateurs
        const averageCity = await this.#CityService.getAvergageCities(
          InputPost.cityId
        );
        return averageCity;
      });
      const post = await this.#PostUseCase.update(InputPost);
      if (post) {
        res.status(200).json(post);
        return;
      }
    } catch (error) {
      if (error instanceof Error) {
        if (error.message == "Impossible to update post") {
          res.status(404).json({ message: error.message });
          return;
        } else {
          res.status(500).json({ message: error.message });
          return;
        }
      }
    }
  }

  async delete(
    req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>,
    res: Response<any, Record<string, any>>
  ): Promise<void> {
    try {
      const { id } = req.body;
      const { cityId } = req.params;
      // reflection sur les décorateurs
      this.#PostUseCase.addObserver("create", async () => {
        const averageCity = await this.#CityService.getAvergageCities(cityId);
        return averageCity;
      });

      const post = await this.#PostUseCase.delete(id);

      if (post) {
        res.status(200).json({ message: "Post deleted" });
        return;
      }
    } catch (error) {
      if (error instanceof Error) {
        if (error.message == "Impossible to delete post") {
          res.status(404).json({ message: error.message });
          return;
        } else {
          res.status(500).json({ message: error.message });
          return;
        }
      }
    }
  }

  async getPost(
    req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>,
    res: Response<any, Record<string, any>>
  ): Promise<void> {
    try {
      const allPost = await this.#PostUseCase.readAll();
      res.status(200).json(allPost);
      return;
    } catch (error) {
      if (error instanceof Error) {
        if (error.message == "Impossible to get List") {
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

export { router as postControllerRouter };
