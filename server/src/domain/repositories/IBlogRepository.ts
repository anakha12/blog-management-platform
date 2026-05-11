import { Blog } from "../entities/Blog";

export interface IBlogRepository {
  create(blog: Omit<Blog, "id">): Promise<Blog>;
  findById(id: string): Promise<Blog | null>;
  findAll(): Promise<Blog[]>;
  update(id: string, blogData: Partial<Blog>): Promise<Blog | null>;
  delete(id: string): Promise<boolean>;
}
