import { Request, Response } from "express";
import { ISessionService } from "./useCase";

import { Router } from "express";

const router = Router();

export class SessionController {
  #sessionService: ISessionService;
  constructor(sessionService: ISessionService) {
    this.#sessionService = sessionService;

    router.get("/session", this.readSession.bind(this));
    router.delete("/logout", this.logout.bind(this));
  }

  async readSession(req: Request, res: Response) {
    try {
      const { sessionId } = req.body;
      const session = await this.#sessionService.getSessionById(sessionId);
      if (session) {
        res.status(200).json(session);
      }
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

  async logout(req: Request, res: Response) {
    try {
      const { sessionId } = req.cookies;

      const session = await this.#sessionService.deleteSession(sessionId);

      res.clearCookie(sessionId);
      res.status(200).json({ message: "Session deleted: ", session });
    } catch (error) {
      if (error instanceof Error) {
        console.error(error);
        if (error.message === "Session Not Found") {
          res.status(404).json({ message: error.message });
        } else {
          res.status(500).json({ message: "Internal Error" });
        }
      }
    }
  }
}

export { router as SessionControllerRouter };
