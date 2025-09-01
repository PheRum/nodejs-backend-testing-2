import { PostsService } from './posts.service';

describe('PostsService', () => {
  let postsService: PostsService;

  beforeEach(() => {
    postsService = new PostsService();
  });

  describe('.create', () => {
    it('should create a new post with auto-generated id', () => {
      const postData = { text: 'Test post' };
      const createdPost = postsService.create(postData);

      expect(createdPost).toEqual({
        id: '1',
        text: 'Test post'
      });
    });

    it('should increment id for each new post', () => {
      const post1 = postsService.create({ text: 'First post' });
      const post2 = postsService.create({ text: 'Second post' });

      expect(post1.id).toBe('1');
      expect(post2.id).toBe('2');
    });
  });

  describe('.findMany', () => {
    const posts = [
      { text: 'Post 1' },
      { text: 'Post 2' },
      { text: 'Post 3' },
      { text: 'Post 4' },
      { text: 'Post 5' },
    ];

    beforeEach(() => {
      posts.forEach((post) => {
        postsService.create(post);
      });
    });

    it('should return all posts if called without options', () => {
      const result = postsService.findMany();
      expect(result).toHaveLength(5);
      expect(result[0].text).toBe('Post 1');
      expect(result[4].text).toBe('Post 5');
    });

    it('should return correct posts for skip and limit options', () => {
      const result = postsService.findMany({ skip: 1, limit: 2 });
      expect(result).toHaveLength(2);
      expect(result[0].text).toBe('Post 2');
      expect(result[1].text).toBe('Post 3');
    });

    it('should handle skip option only', () => {
      const result = postsService.findMany({ skip: 2 });
      expect(result).toHaveLength(3);
      expect(result[0].text).toBe('Post 3');
    });

    it('should handle limit option only', () => {
      const result = postsService.findMany({ limit: 3 });
      expect(result).toHaveLength(3);
      expect(result[0].text).toBe('Post 1');
      expect(result[2].text).toBe('Post 3');
    });

    it('should return empty array when skip exceeds posts count', () => {
      const result = postsService.findMany({ skip: 10 });
      expect(result).toHaveLength(0);
    });

    it('should return all posts when limit exceeds posts count', () => {
      const result = postsService.findMany({ limit: 10 });
      expect(result).toHaveLength(5);
    });

    it('should return empty array when no posts exist', () => {
      const emptyService = new PostsService();
      const result = emptyService.findMany();
      expect(result).toHaveLength(0);
    });
  });

  describe('.find', () => {
    beforeEach(() => {
      postsService.create({ text: 'Test post' });
    });

    it('should find post by id', () => {
      const foundPost = postsService.find('1');
      expect(foundPost).toEqual({
        id: '1',
        text: 'Test post'
      });
    });

    it('should return undefined for non-existent id', () => {
      const foundPost = postsService.find('999');
      expect(foundPost).toBeUndefined();
    });

    it('should return undefined for invalid id', () => {
      const foundPost = postsService.find('invalid');
      expect(foundPost).toBeUndefined();
    });
  });

  describe('.delete', () => {
    beforeEach(() => {
      postsService.create({ text: 'Post 1' });
      postsService.create({ text: 'Post 2' });
    });

    it('should delete post by id', () => {
      postsService.delete('1');
      const remainingPosts = postsService.findMany();
      expect(remainingPosts).toHaveLength(1);
      expect(remainingPosts[0].id).toBe('2');
    });

    it('should not affect other posts when deleting', () => {
      postsService.delete('1');
      const remainingPosts = postsService.findMany();
      expect(remainingPosts[0].text).toBe('Post 2');
    });

    it('should handle deletion of non-existent post', () => {
      const initialPosts = postsService.findMany();
      postsService.delete('999');
      const remainingPosts = postsService.findMany();
      expect(remainingPosts).toEqual(initialPosts);
    });
  });

  describe('.update', () => {
    beforeEach(() => {
      postsService.create({ text: 'Original text' });
    });

    it('should update post text', () => {
      postsService.update('1', { text: 'Updated text' });
      const updatedPost = postsService.find('1');
      expect(updatedPost?.text).toBe('Updated text');
    });

    it('should throw error when updating non-existent post', () => {
      expect(() => {
        postsService.update('999', { text: 'New text' });
      }).toThrow('Пост не найден');
    });

    it('should preserve post id after update', () => {
      postsService.update('1', { text: 'Updated text' });
      const updatedPost = postsService.find('1');
      expect(updatedPost?.id).toBe('1');
    });
  });
});