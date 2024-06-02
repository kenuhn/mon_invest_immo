import { prisma } from "../../db/client";
import { TSessionEntity } from "./entity";

export interface ISessionRepository {
  saveSession(Session: TSessionEntity): Promise<TSessionEntity>;
  deleteSession(sessionId: string): Promise<TSessionEntity>;
  getSession(sessionId: string): Promise<TSessionEntity>;
}

export class SessionRepository implements ISessionRepository {
  async saveSession(Session: TSessionEntity) {
    const session: TSessionEntity = await prisma.session.create({
      data: {
        id: Session.id,
        userId: Session.userId,
      },
    });
    if (session) {
      return session;
    }

    throw new Error("Cannot save Session ");
  }

  async deleteSession(sessionId: string): Promise<TSessionEntity> {
    const session = await prisma.session.delete({
      where: {
        id: sessionId,
      },
    });
    if (session) {
      return session;
    }

    throw new Error("Cannot delete Session ");
  }

  async getSession(sessionId: string): Promise<TSessionEntity> {
    const session = await prisma.session.findUnique({
      where: {
        id: sessionId,
      },
    });
    if (session) {
      return session;
    }

    throw new Error("Cannot delete Session ");
  }
}
