import { IIdGenerator } from "../../utils/services/idGenerator";

export type NewComments = {
  postId: string;
  text: string;
};

export type ExistingsComments = NewComments & {
  id: string;
};

export interface ICommentsEntity {
  comments: NewComments;
  getComments(): NewComments;
}

export class CommentsEntity implements ICommentsEntity {
  comments: NewComments;
  idGenerator: IIdGenerator;

  constructor(comments: NewComments, idGenerator: IIdGenerator) {
    this.comments = comments;
    this.idGenerator = idGenerator;
  }
  setId() {
    return this.idGenerator.generate();
  }

  getComments(): ExistingsComments {
    return { ...this.comments, id: this.setId() };
  }
}
