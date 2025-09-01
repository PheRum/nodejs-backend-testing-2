import { Injectable } from '@nestjs/common';

export interface Post {
  id: string;
  text: string;
}

export interface FindManyOptions {
  skip?: number;
  limit?: number;
  before?: string;
  after?: string;
}

@Injectable()
export class PostsService {
  private posts: Post[] = [];
  private lastPostId = 1;

  create(post: Omit<Post, 'id' | 'date'>) {
    const postWithId: Post = {
      ...post,
      id: this.lastPostId.toString(),
    };

    this.lastPostId++;

    this.posts.push(postWithId);

    return postWithId;
  }

  findMany({ skip, limit }: FindManyOptions = {}) {
    let foundPosts = this.posts;

    // Stryker disable next-line ConditionalExpression: The "true" mutant results in an equivalent mutant
    if (skip !== undefined) {
      foundPosts = foundPosts.slice(skip);
    }

    // Stryker disable next-line ConditionalExpression: The "true" mutant results in an equivalent mutant
    if (limit !== undefined) {
      foundPosts = foundPosts.slice(0, limit);
    }

    return foundPosts;
  }

  find(postId: string) {
    return this.posts.find(({ id }) => id === postId);
  }

  delete(postId: string) {
    this.posts = this.posts.filter(({ id }) => id !== postId);
  }

  update(postId: string, post: Pick<Post, 'text'>) {
    const postToUpdate = this.find(postId);

    if (!postToUpdate) {
      throw new Error('Пост не найден');
    }

    Object.assign(postToUpdate, post);
  }
}