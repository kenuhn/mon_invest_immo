import { IIdGenerator } from "../../utils/services/idGenerator";
import {
  CommentsEntity,
  ExistingsComments,
  NewComments,
} from "../comments/entity";
import { ExistingRating, NewRating, RatingEntity } from "../ratings/entity";

type GenericPost<TText, TRatings> = {
  authorId: string;
  cityId: string;
  date: Date;
  comments: TText | null;
  ratings: TRatings | null;
};

export type NewPost = GenericPost<NewComments, NewRating>;
export type ExistingPost = GenericPost<ExistingsComments, ExistingRating> & {
  id: string;
};

export interface IPost {
  post: NewPost;
  setDate(): Date;
  setId(): string;
}

export class Post implements IPost {
  post: NewPost;
  #postId: string;
  idGenerator: IIdGenerator;

  constructor(post: NewPost, idGenerator: IIdGenerator) {
    this.idGenerator = idGenerator;
    this.post = post;
    this.#postId = this.setId();
  }

  setDate() {
    const date = new Date();
    return date;
  }

  setId() {
    const newId = this.idGenerator.generate();
    if (newId) {
      return newId;
    }
    throw new Error("impossible to set ID");
  }

  setExistingPost(): ExistingPost {
    const postId = this.#postId;
    const newPost: NewPost = this.post;
    if (!newPost.comments || !newPost.ratings) {
      throw new Error("Comments is empty");
    }
    const newRating = new RatingEntity(newPost.ratings, this.idGenerator);
    const newComments = new CommentsEntity(newPost.comments, this.idGenerator);

    const existingPost: ExistingPost = {
      ...newPost,
      id: postId,
      date: this.setDate(),
      comments: newComments.getComments(),
      ratings: newRating.getRating(),
    };
    return existingPost;
  }
}
