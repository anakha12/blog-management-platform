import { Blog } from "../models/Blog";

export interface CreateBlogInput {
  title: string;
  content: string;
  image?: File;
}

export interface UpdateBlogInput {
  title?: string;
  content?: string;
  image?: File;
}

export interface IBlogRepository {
  getAll(): Promise<Blog[]>;
  getById(id: string): Promise<Blog>;
  create(data: CreateBlogInput): Promise<Blog>;
  update(id: string, data: UpdateBlogInput): Promise<Blog>;
  delete(id: string): Promise<void>;
}
