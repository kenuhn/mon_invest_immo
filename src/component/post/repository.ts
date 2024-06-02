import { prisma } from "../../db/client";
import { ExistingPost } from "./entity";
export interface IPostsRepository {
  findAll(): Promise<ExistingPost[]>;
  findByUserId(id: string): Promise<ExistingPost[]>;
  findByCityId(cityId: string): Promise<ExistingPost[]>;
  insert(post: ExistingPost): Promise<ExistingPost>;
  update(post: ExistingPost): Promise<ExistingPost | null>;
  remove(id: string): Promise<ExistingPost>;
}

export class PostRepository implements IPostsRepository {
  async findAll(): Promise<ExistingPost[]> {
    const posts: ExistingPost[] = await prisma.post.findMany({
      include: {
        comments: true,
        ratings: true,
      },
    });
    return posts;
  }
  async findByUserId(userId: string): Promise<ExistingPost[]> {
    const posts: ExistingPost[] = await prisma.post.findMany({
      where: {
        authorId: userId,
      },
      include: {
        comments: true,
        ratings: true,
      },
    });
    return posts;
  }
  async findByCityId(cityId: string): Promise<ExistingPost[]> {
    const posts: ExistingPost[] = await prisma.post.findMany({
      where: {
        cityId: cityId,
      },
      include: {
        comments: true,
        ratings: true,
      },
    });
    return posts;
  }
  async insert(reqPost: ExistingPost): Promise<ExistingPost> {
    const { id, date, authorId, cityId, comments, ratings }: ExistingPost =
      reqPost;

    if (!comments || !ratings) {
      throw new Error("Comments is empty");
    }
    const newPost = prisma.post.create({
      data: {
        id: id,
        authorId: authorId,
        date: date,
        cityId: cityId,
        comments: {
          create: { text: comments.text },
        },

        ratings: {
          create: {
            rentaLocative: ratings.rentaLocative,
            dispo: ratings.dispo,
            coPropriete: ratings.coPropriete,
            tentionLocative: ratings.tentionLocative,
            moyenne: ratings.moyenne,
          },
        },
      },
      include: {
        comments: true,
        ratings: true,
      },
    });
    return newPost;
  }
  async update(reqPost: ExistingPost): Promise<ExistingPost | null> {
    const { id, date, authorId, cityId, comments, ratings } = reqPost;

    if (!comments || !ratings) {
      throw new Error("Comments is empty");
    }

    const updatedPost = await prisma.post.update({
      where: {
        id: id,
      },
      data: {
        authorId: authorId,
        date: date,
        cityId: cityId,
        comments: {
          delete: { postId: id },
          update: {
            text: comments.text,
          },
        },
        ratings: {
          delete: { postId: id },
          create: {
            rentaLocative: ratings.rentaLocative,
            dispo: ratings.dispo,
            coPropriete: ratings.coPropriete,
            tentionLocative: ratings.tentionLocative,
            moyenne: ratings.moyenne,
          },
        },
      },
      include: {
        comments: true,
        ratings: true,
      },
    });
    return updatedPost;
  }
  async remove(id: string): Promise<ExistingPost> {
    const postDeleted = await prisma.post.delete({
      where: {
        id: id,
      },
      include: {
        comments: true,
        ratings: true,
      },
    });

    return postDeleted;
  }
}
