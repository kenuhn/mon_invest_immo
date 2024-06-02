import { Request, Response, Router } from "express";

import { NewUser } from "./entity";
import { IUserService } from "./useCase";

interface IUserController {
  signUp(req: Request, res: Response): void;
  getUserById(req: Request, res: Response): void;
}

const router = Router();

export class UserController implements IUserController {
  #UserService: IUserService;

  constructor(UserService: IUserService) {
    this.#UserService = UserService;
    router.get("/user-email", this.getByEmail.bind(this));
    router.post("/signup", this.signUp.bind(this));
    router.post("/login", this.login.bind(this));

    router.get("/user/:id", this.getUserById.bind(this));
    router.get("/user", this.getUser.bind(this));
    router.delete("/user/:id", this.deleteUser.bind(this));
  }

  async signUp(req: Request, res: Response) {
    try {
      const { email, password }: NewUser = req.body;

      const { id } = await this.#UserService.create({ email, password });
      res.status(201).json({ message: " User created" + id });
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === "Account already exist") {
          res.status(400).json({ message: error.message });
        } else {
          res.status(500).json({ message: "Internal Error", error });
        }
      }
    }
  }

  async getUserById(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const userFind = await this.#UserService.readbyId(id);

      res.status(200).json({ message: "User find" + userFind });
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === "User not Found") {
          res.status(404).json({ message: error.message });
        } else {
          res.status(500).json({ message: "Internal Error" });
        }
      }
    }
  }

  async getUser(req: Request, res: Response) {
    try {
      const allUsers = await this.#UserService.readAll();
      if (allUsers) {
        res.status(200).json(allUsers);
        return;
      }
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === "User not Found") {
          res.status(404).json({ message: error.message });
        } else {
          res.status(500).json({ message: "Internal Error" });
        }
      }
    }
  }

  async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;
      const userFound = await this.#UserService.readbyEmail(email);
      console.log(req.body);
      const newSession = await this.#UserService.login(userFound, password);
      res.cookie("sessionId", newSession.id, { httpOnly: false });
      res.status(200).json({ message: "User connected : ", newSession });
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === "User not Found") {
          res.status(404).json({ message: error.message });
        } else if (error.message === "Not Same Password") {
          res.status(400).json({ message: error.message });
        } else {
          res.status(500).json({ message: "Internal Error" });
        }
      }
    }
  }

  async getByEmail(req: Request, res: Response) {
    try {
      const { email } = req.body;
      console.log(email);

      const user = await this.#UserService.readbyEmail(email);
      console.log("user", user);
      res.status(200).json({ message: "User find: ", user });
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === "User not Found") {
          res.status(404).json({ message: error.message });
        } else {
          res.status(500).json({ message: "Internal Error" });
        }
      }
    }
  }

  async deleteUser(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const user = await this.#UserService.deleteUser(id);

      res.status(200).json({ message: "User deleted: ", user });
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === "User not Found") {
          res.status(404).json({ message: error.message });
        } else {
          res.status(500).json({ message: "Internal Error" });
        }
      }
    }
  }
}

export { router as UserControllerRouter };
