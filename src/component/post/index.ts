import { IdGenerator } from "../../utils/services/idGenerator";
import { PostRepository } from "./repository";
import { PostsUseCase } from "./useCase";

const postRepository = new PostRepository();
const idGenerator = new IdGenerator();

const postUseCase = new PostsUseCase(postRepository, idGenerator);

export { postUseCase as PostService };
