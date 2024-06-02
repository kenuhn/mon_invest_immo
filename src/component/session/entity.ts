export type TSessionEntity = {
  id: string;
  userId: string;
};

export type ISessionEntity = {
  session: TSessionEntity;

  getSession(): TSessionEntity;
};

export class SessionEntity implements ISessionEntity {
  session: TSessionEntity;
  constructor(session: TSessionEntity) {
    this.session = session;
  }

  getSession() {
    const { id, userId } = this.session;
    return { id: id, userId: userId };
  }
}
