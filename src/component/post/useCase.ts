import { IIdGenerator } from "../../utils/services/idGenerator";
import { ExistingPost, NewPost, Post } from "./entity";
import { IPostsRepository } from "./repository";

export interface IPostsUseCase {
  readAll(): Promise<ExistingPost[]>;
  readByUserId(id: string): Promise<ExistingPost[]>;
  readByCity(cityId: string): Promise<ExistingPost[]>;
  create(post: NewPost): Promise<ExistingPost>;
  update(post: NewPost): Promise<ExistingPost | null>;
  delete(id: string): Promise<ExistingPost>;
  addObserver(type: postObserverType, callback: any): void;
}
type postObserverType = "create" | "update" | "delete";

export class PostsUseCase implements IPostsUseCase {
  #PostRepository;
  IIdGenerator: IIdGenerator;
  #object: { create: any[]; update: any[]; delete: any[] };

  constructor(PostRepository: IPostsRepository, IIdGenerator: IIdGenerator) {
    this.#PostRepository = PostRepository;
    this.IIdGenerator = IIdGenerator;
    this.#object = { create: [], update: [], delete: [] };
  }

  addObserver(type: postObserverType, callback: any) {
    if (!this.#object[type].includes(callback)) {
      this.#object[type].push(callback);
    }
  }

  private dispatch(type: postObserverType) {
    if (this.#object[type].length > 0) {
      for (let callback of this.#object[type]) {
        callback();
      }
    }
  }

  async readAll(): Promise<ExistingPost[]> {
    const postList = await this.#PostRepository.findAll();
    if (postList) {
      return postList;
    }
    throw new Error("Impossible to get List");
  }

  async readByCity(cityId: string): Promise<ExistingPost[]> {
    const postList = await this.#PostRepository.findByCityId(cityId);
    if (postList) {
      return postList;
    }
    throw new Error("Impossible to get List");
  }

  async readByUserId(id: string): Promise<ExistingPost[]> {
    const postList = await this.#PostRepository.findByUserId(id);
    if (postList) {
      return postList;
    }
    throw new Error("Impossible to get List");
  }

  async readByCityId(cityId: string): Promise<ExistingPost[]> {
    const postList = await this.#PostRepository.findByCityId(cityId);
    if (postList) {
      return postList;
    }
    throw new Error("Impossible to get List");
  }

  async create(post: NewPost): Promise<ExistingPost> {
    const newInputPost = new Post(post, this.IIdGenerator);
    const existingPost: ExistingPost = newInputPost.setExistingPost();
    const user = await this.#PostRepository.insert(existingPost);
    if (user) {
      this.dispatch("create");
      return user;
    }
    throw new Error("Impossible to create post");
  }

  async update(post: ExistingPost): Promise<ExistingPost | null> {
    const user = await this.#PostRepository.update(post);
    if (user) {
      this.dispatch("update");
      return user;
    }
    throw new Error("Impossible to update post");
  }

  async delete(id: string): Promise<ExistingPost> {
    const user = await this.#PostRepository.remove(id);
    if (user) {
      this.dispatch("delete");
      return user;
    }
    throw new Error("Impossible to delete post");
  }
}
